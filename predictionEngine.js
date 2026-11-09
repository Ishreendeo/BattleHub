// Deterministic-ish AI-style prediction engine driven entirely by team stat objects.
// No network calls - all computation happens client-side from current app state.

function formScore(recentForm = []) {
  if (!recentForm.length) return 50;
  const weights = [1, 1.2, 1.4, 1.6, 2]; // more recent matches weigh more
  let total = 0;
  let max = 0;
  recentForm.forEach((res, i) => {
    const w = weights[i] ?? 1;
    max += w;
    if (res === 'W') total += w;
  });
  return (total / max) * 100;
}

function mapWinRate(team, mapName) {
  if (!mapName) return team.stats.winRate;
  return team.stats.mapWinRates?.[mapName] ?? team.stats.winRate;
}

function normalizeKD(kd) {
  // squash KD (roughly 0.7 - 1.7 range) into a 0-100 scale
  const clamped = Math.max(0.5, Math.min(1.8, kd));
  return ((clamped - 0.5) / (1.8 - 0.5)) * 100;
}

export function buildComparison(teamA, teamB, mapName) {
  const metrics = ['Win Rate', 'Avg K/D', 'Recent Form', 'Map Win Rate', 'Experience'];

  const expA = Math.min(100, (teamA.stats.tournamentsPlayed / 30) * 100);
  const expB = Math.min(100, (teamB.stats.tournamentsPlayed / 30) * 100);

  const a = [
    teamA.stats.winRate,
    normalizeKD(teamA.stats.avgKD),
    formScore(teamA.stats.recentForm),
    mapWinRate(teamA, mapName),
    expA,
  ];
  const b = [
    teamB.stats.winRate,
    normalizeKD(teamB.stats.avgKD),
    formScore(teamB.stats.recentForm),
    mapWinRate(teamB, mapName),
    expB,
  ];

  return metrics.map((metric, i) => ({
    metric,
    [teamA.tag]: Math.round(a[i]),
    [teamB.tag]: Math.round(b[i]),
  }));
}

export function keyStrengths(team) {
  const s = team.stats;
  const strengths = [];
  if (s.winRate >= 72) strengths.push(`Elite ${s.winRate}% overall win rate`);
  else if (s.winRate >= 60) strengths.push(`Consistent ${s.winRate}% win rate`);

  if (s.avgKD >= 1.2) strengths.push(`Aggressive fragging, ${s.avgKD.toFixed(2)} avg K/D`);
  else strengths.push(`Balanced trade-based playstyle`);

  const wins = s.recentForm.filter((r) => r === 'W').length;
  if (wins >= 4) strengths.push('Riding a hot streak, 4+ wins in last 5');
  else if (wins <= 1) strengths.push('Struggling for form recently');

  if (s.tournamentsPlayed >= 22) strengths.push(`Battle-tested with ${s.tournamentsPlayed} events played`);

  const bestMap = Object.entries(s.mapWinRates || {}).sort((a, b) => b[1] - a[1])[0];
  if (bestMap) strengths.push(`Dominant on ${bestMap[0]} (${bestMap[1]}% win rate)`);

  return strengths.slice(0, 4);
}

export function predictMatch(teamA, teamB, mapName) {
  // Weighted scoring model across 5 factors
  const weights = {
    winRate: 0.28,
    kd: 0.22,
    form: 0.22,
    map: 0.18,
    experience: 0.1,
  };

  const scoreFor = (team) => {
    const expNorm = Math.min(100, (team.stats.tournamentsPlayed / 30) * 100);
    return (
      team.stats.winRate * weights.winRate +
      normalizeKD(team.stats.avgKD) * weights.kd +
      formScore(team.stats.recentForm) * weights.form +
      mapWinRate(team, mapName) * weights.map +
      expNorm * weights.experience
    );
  };

  const rawA = scoreFor(teamA);
  const rawB = scoreFor(teamB);
  const total = rawA + rawB || 1;

  let probA = Math.round((rawA / total) * 100);
  let probB = 100 - probA;

  // keep predictions within a believable esports band
  probA = Math.min(88, Math.max(12, probA));
  probB = 100 - probA;

  const winner = probA >= probB ? teamA : teamB;
  const loser = probA >= probB ? teamB : teamA;
  const margin = Math.abs(probA - probB);

  // confidence rises with margin and with data volume (tournament experience)
  const dataDepth = Math.min(1, (teamA.stats.tournamentsPlayed + teamB.stats.tournamentsPlayed) / 50);
  const confidence = Math.min(97, Math.round(58 + margin * 0.5 + dataDepth * 12));

  const mvp = (team) =>
    [...team.players].sort((p1, p2) => p2.kd - p1.kd)[0];

  const reasons = [];
  if (winner.stats.winRate - loser.stats.winRate >= 3) {
    reasons.push(`${winner.name} holds a stronger overall win rate (${winner.stats.winRate}% vs ${loser.stats.winRate}%).`);
  }
  if (winner.stats.avgKD - loser.stats.avgKD >= 0.02) {
    reasons.push(`Higher average kill/death ratio for ${winner.name} (${winner.stats.avgKD.toFixed(2)} vs ${loser.stats.avgKD.toFixed(2)}).`);
  }
  const fA = formScore(winner.stats.recentForm);
  const fB = formScore(loser.stats.recentForm);
  if (fA - fB >= 3) {
    reasons.push(`${winner.name} arrives in better recent form across the last 5 matches.`);
  }
  if (mapName) {
    const mwA = mapWinRate(winner, mapName);
    const mwB = mapWinRate(loser, mapName);
    if (mwA - mwB >= 2) {
      reasons.push(`Stronger win rate on ${mapName} (${mwA}% vs ${mwB}%).`);
    }
  }
  if (winner.stats.tournamentsPlayed - loser.stats.tournamentsPlayed >= 2) {
    reasons.push(`More tournament experience with ${winner.stats.tournamentsPlayed} events played.`);
  }
  if (reasons.length === 0) {
    reasons.push(`${winner.name} edges this matchup on marginal statistical advantages across the board.`);
  }

  return {
    teamA: { team: teamA, probability: probA },
    teamB: { team: teamB, probability: probB },
    winner,
    confidence,
    mvpA: mvp(teamA),
    mvpB: mvp(teamB),
    reasons,
    comparison: buildComparison(teamA, teamB, mapName),
  };
}
