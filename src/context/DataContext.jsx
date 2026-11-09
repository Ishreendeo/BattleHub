import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import seedTeams from '../data/teams.json';
import seedTournaments from '../data/tournaments.json';
import { predictMatch } from '../utils/predictionEngine';

const DataContext = createContext(null);
const STORAGE_KEY = 'battlehub_data_v2';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        teams: parsed.teams?.length ? parsed.teams : seedTeams,
        tournaments: parsed.tournaments?.length ? parsed.tournaments : seedTournaments,
        brackets: parsed.brackets || {},
        matches: parsed.matches || [],
      };
    }
  } catch {
    /* fall through to seed */
  }
  return { teams: seedTeams, tournaments: seedTournaments, brackets: {}, matches: [] };
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function pairTeamsForBracket(teamIds) {
  const ids = [...teamIds];
  // pad to next power of two with BYE slots
  let size = 1;
  while (size < ids.length) size *= 2;
  while (ids.length < size) ids.push(null);
  const matches = [];
  for (let i = 0; i < ids.length; i += 2) {
    matches.push({ id: uid('bm'), teamAId: ids[i], teamBId: ids[i + 1] ?? null, winnerId: ids[i + 1] == null && ids[i] ? ids[i] : null });
  }
  return matches;
}

function buildInitialBracket(teamIds) {
  if (teamIds.length < 2) return { rounds: [] };
  const round1 = pairTeamsForBracket(teamIds);
  const rounds = [round1];
  let count = round1.length;
  while (count > 1) {
    count = Math.ceil(count / 2);
    rounds.push(Array.from({ length: count }, () => ({ id: uid('bm'), teamAId: null, teamBId: null, winnerId: null })));
  }
  return { rounds };
}

export function DataProvider({ children }) {
  const [state, setState] = useState(loadInitial);
  const tickRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // global 1s ticker for any running match timers
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setState((prev) => {
        const hasRunning = prev.matches.some((m) => m.isRunning);
        if (!hasRunning) return prev;
        return {
          ...prev,
          matches: prev.matches.map((m) =>
            m.isRunning ? { ...m, elapsedSeconds: m.elapsedSeconds + 1 } : m
          ),
        };
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const getTeam = useCallback((id) => state.teams.find((t) => t.id === id), [state.teams]);

  // ---------- TEAMS ----------
  const createTeam = useCallback((data) => {
    const name = data.name?.trim();
    if (!name) return { ok: false, error: 'Team name is required.' };
    if (state.teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, error: 'A team with this name already exists.' };
    }
    const newTeam = {
      id: uid('team'),
      name,
      tag: (data.tag || name.slice(0, 3)).toUpperCase(),
      logo: data.logo || '🎮',
      region: data.region || 'Unassigned',
      games: data.games?.length ? data.games : ['valorant'],
      players: data.players?.length ? data.players : [{ name: 'Player 1', role: 'Flex', kd: 1.0 }],
      stats: {
        winRate: 50,
        avgKD: 1.0,
        tournamentsPlayed: 0,
        recentForm: [],
        mapWinRates: {},
      },
      custom: true,
    };
    setState((prev) => ({ ...prev, teams: [...prev.teams, newTeam] }));
    toast.success(`${name} was created.`);
    return { ok: true, team: newTeam };
  }, [state.teams]);

  const updateTeam = useCallback((teamId, updates) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === teamId ? { ...t, ...updates } : t)),
    }));
    toast.success('Team updated.');
  }, []);

  const addTeamMember = useCallback((teamId, member) => {
    if (!member?.name?.trim()) {
      toast.error('Member name is required.');
      return;
    }
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, players: [...t.players, { name: member.name.trim(), role: member.role || 'Flex', kd: Number(member.kd) || 1.0 }] } : t
      ),
    }));
    toast.success('Member added.');
  }, []);

  const removeTeamMember = useCallback((teamId, index) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, players: t.players.filter((_, i) => i !== index) } : t
      ),
    }));
    toast('Member removed.', { icon: '🗑️' });
  }, []);

  // ---------- TOURNAMENTS ----------
  const registerTeamToTournament = useCallback((tournamentId, teamId) => {
    const tournament = state.tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return { ok: false, error: 'Tournament not found.' };
    if (tournament.registeredTeamIds.includes(teamId)) {
      return { ok: false, error: 'This team is already registered.' };
    }
    if (tournament.registeredTeamIds.length >= tournament.maxTeams) {
      return { ok: false, error: 'Tournament is full.' };
    }
    const newIds = [...tournament.registeredTeamIds, teamId];
    setState((prev) => ({
      ...prev,
      tournaments: prev.tournaments.map((t) =>
        t.id === tournamentId ? { ...t, registeredTeamIds: newIds } : t
      ),
      brackets: {
        ...prev.brackets,
        [tournamentId]: bracketHasStarted(prev.brackets[tournamentId])
          ? prev.brackets[tournamentId]
          : buildInitialBracket(newIds),
      },
    }));
    const team = getTeam(teamId);
    toast.success(`${team?.name || 'Team'} registered for ${tournament.name}!`);
    return { ok: true };
  }, [state.tournaments, getTeam]);

  // ---------- BRACKETS ----------
  const ensureBracket = useCallback((tournamentId) => {
    const tournament = state.tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;
    setState((prev) => {
      if (prev.brackets[tournamentId]) return prev;
      return { ...prev, brackets: { ...prev.brackets, [tournamentId]: buildInitialBracket(tournament.registeredTeamIds) } };
    });
  }, [state.tournaments]);

  const simulateBracketMatch = useCallback((tournamentId, roundIndex, matchIndex) => {
    setState((prev) => {
      const bracket = prev.brackets[tournamentId];
      if (!bracket) return prev;
      const match = bracket.rounds[roundIndex][matchIndex];
      if (!match || match.winnerId || !match.teamAId || !match.teamBId) return prev;

      const teamA = prev.teams.find((t) => t.id === match.teamAId);
      const teamB = prev.teams.find((t) => t.id === match.teamBId);
      let winnerId = match.teamAId;
      if (teamA && teamB) {
        const prediction = predictMatch(teamA, teamB);
        winnerId = Math.random() * 100 < prediction.teamA.probability ? teamA.id : teamB.id;
      }

      const newRounds = bracket.rounds.map((r) => r.map((m) => ({ ...m })));
      newRounds[roundIndex][matchIndex].winnerId = winnerId;

      if (roundIndex + 1 < newRounds.length) {
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const slot = matchIndex % 2 === 0 ? 'teamAId' : 'teamBId';
        newRounds[roundIndex + 1][nextMatchIndex][slot] = winnerId;
      }

      // create a completed match record for leaderboard purposes
      const scoreWinner = 13;
      const scoreLoser = Math.floor(Math.random() * 10) + 2;
      const matchRecord = {
        id: uid('match'),
        tournamentId,
        teamAId: match.teamAId,
        teamBId: match.teamBId,
        game: prev.tournaments.find((t) => t.id === tournamentId)?.game || 'valorant',
        scoreA: winnerId === match.teamAId ? scoreWinner : scoreLoser,
        scoreB: winnerId === match.teamBId ? scoreWinner : scoreLoser,
        status: 'completed',
        isRunning: false,
        elapsedSeconds: 0,
        winnerId,
        round: `Bracket R${roundIndex + 1}`,
        scheduledDate: new Date().toISOString(),
      };

      const winnerName = prev.teams.find((t) => t.id === winnerId)?.name || 'Team';
      toast.success(`${winnerName} advances in the bracket!`);

      return {
        ...prev,
        brackets: { ...prev.brackets, [tournamentId]: { rounds: newRounds } },
        matches: [...prev.matches, matchRecord],
      };
    });
  }, []);

  // ---------- LIVE MATCH CENTER / SCHEDULE ----------
  const addMatch = useCallback((data) => {
    if (!data.teamAId || !data.teamBId) {
      toast.error('Both teams are required.');
      return { ok: false };
    }
    if (data.teamAId === data.teamBId) {
      toast.error('Teams must be different.');
      return { ok: false };
    }
    const newMatch = {
      id: uid('match'),
      tournamentId: data.tournamentId || null,
      teamAId: data.teamAId,
      teamBId: data.teamBId,
      game: data.game || 'valorant',
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      isRunning: false,
      elapsedSeconds: 0,
      winnerId: null,
      round: data.round || 'Scheduled Match',
      scheduledDate: data.scheduledDate || new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, matches: [newMatch, ...prev.matches] }));
    toast.success('Match added to schedule.');
    return { ok: true, match: newMatch };
  }, []);

  const updateMatch = useCallback((id, updates) => {
    setState((prev) => ({ ...prev, matches: prev.matches.map((m) => (m.id === id ? { ...m, ...updates } : m)) }));
  }, []);

  const removeMatch = useCallback((id) => {
    setState((prev) => ({ ...prev, matches: prev.matches.filter((m) => m.id !== id) }));
    toast('Match removed.', { icon: '🗑️' });
  }, []);

  const startMatch = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => (m.id === id ? { ...m, status: 'live', isRunning: true } : m)),
    }));
    toast.success('Match started!');
  }, []);

  const pauseMatch = useCallback((id) => {
    setState((prev) => ({ ...prev, matches: prev.matches.map((m) => (m.id === id ? { ...m, isRunning: false } : m)) }));
  }, []);

  const resetMatch = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === id ? { ...m, scoreA: 0, scoreB: 0, elapsedSeconds: 0, isRunning: false, status: 'scheduled', winnerId: null } : m
      ),
    }));
  }, []);

  const adjustScore = useCallback((id, side, delta) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => {
        if (m.id !== id) return m;
        const key = side === 'A' ? 'scoreA' : 'scoreB';
        return { ...m, [key]: Math.max(0, m[key] + delta) };
      }),
    }));
  }, []);

  const finishMatch = useCallback((id) => {
    setState((prev) => {
      const match = prev.matches.find((m) => m.id === id);
      if (!match) return prev;
      const winnerId = match.scoreA === match.scoreB ? null : match.scoreA > match.scoreB ? match.teamAId : match.teamBId;
      const teamName = prev.teams.find((t) => t.id === winnerId)?.name;
      toast.success(teamName ? `Match finished — ${teamName} wins!` : 'Match finished — it\'s a draw.');
      return {
        ...prev,
        matches: prev.matches.map((m) => (m.id === id ? { ...m, status: 'completed', isRunning: false, winnerId } : m)),
      };
    });
  }, []);

  const value = {
    ...state,
    getTeam,
    createTeam,
    updateTeam,
    addTeamMember,
    removeTeamMember,
    registerTeamToTournament,
    ensureBracket,
    simulateBracketMatch,
    addMatch,
    updateMatch,
    removeMatch,
    startMatch,
    pauseMatch,
    resetMatch,
    adjustScore,
    finishMatch,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function bracketHasStarted(bracket) {
  if (!bracket) return false;
  return bracket.rounds.some((round) => round.some((m) => m.winnerId));
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
