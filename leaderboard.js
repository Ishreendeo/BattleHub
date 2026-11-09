export function computeLeaderboard(teams, matches) {
  const completed = matches.filter((m) => m.status === 'completed' && m.winnerId);
  const table = new Map();

  teams.forEach((t) => table.set(t.id, { team: t, wins: 0, losses: 0, played: 0, points: 0 }));

  completed.forEach((m) => {
    [m.teamAId, m.teamBId].forEach((id) => {
      if (id && table.has(id)) table.get(id).played += 1;
    });
    if (m.winnerId && table.has(m.winnerId)) {
      table.get(m.winnerId).wins += 1;
    }
    const loserId = m.winnerId === m.teamAId ? m.teamBId : m.teamAId;
    if (loserId && table.has(loserId)) table.get(loserId).losses += 1;
  });

  const rows = Array.from(table.values())
    .map((row) => ({ ...row, points: row.wins * 3 }))
    .filter((row) => row.played > 0)
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  return rows.map((row, i) => ({ ...row, rank: i + 1 }));
}
