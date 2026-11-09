import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export default function RadarComparison({ data, teamA, teamB }) {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(139,92,246,0.2)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#8b93ab', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#8b93ab', fontSize: 9 }} />
          <Radar name={teamA.name} dataKey={teamA.tag} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} strokeWidth={2} />
          <Radar name={teamB.name} dataKey={teamB.tag} stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} strokeWidth={2} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#8b93ab' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
