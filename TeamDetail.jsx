import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, UserPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import TeamLogo from '../components/team/TeamLogo';
import RecentForm from '../components/ai/RecentForm';
import { TextField, Button } from '../components/common/FormField';
import NotFound from './NotFound';

export default function TeamDetail() {
  const { id } = useParams();
  const { teams, updateTeam, addTeamMember, removeTeamMember } = useData();
  const fileRef = useRef(null);
  const team = teams.find((t) => t.id === id);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(team ? { name: team.name, tag: team.tag, region: team.region } : {});
  const [member, setMember] = useState({ name: '', role: '' });

  if (!team) return <NotFound />;

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateTeam(team.id, { logo: reader.result });
    reader.readAsDataURL(file);
  };

  const saveEdits = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    updateTeam(team.id, { name: form.name.trim(), tag: form.tag.toUpperCase(), region: form.region });
    setEditing(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    addTeamMember(team.id, member);
    setMember({ name: '', role: '' });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/teams" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan mb-6 focus-ring rounded">
        <ArrowLeft size={15} /> Back to teams
      </Link>

      <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex flex-col items-center gap-2">
            <TeamLogo logo={team.logo} size={80} />
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs flex items-center gap-1 text-cyan hover:underline focus-ring rounded"
            >
              <Upload size={12} /> Upload logo
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>

          <div className="flex-1 w-full">
            {editing ? (
              <form onSubmit={saveEdits} className="grid gap-3 sm:grid-cols-3">
                <TextField id="editName" label="Team name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <TextField id="editTag" label="Tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
                <TextField id="editRegion" label="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                <div className="sm:col-span-3 flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold">{team.name}</h1>
                  <p className="text-ink-muted text-sm">{team.tag} · {team.region}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-purple-soft font-semibold">{team.stats.winRate}% Win Rate</span>
                    <span className="text-cyan font-semibold">{team.stats.avgKD.toFixed(2)} Avg K/D</span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setEditing(true)}>Edit Info</Button>
              </div>
            )}
          </div>
        </div>

        {team.stats.recentForm?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-xs text-ink-muted mb-1.5">Recent Form</p>
            <RecentForm form={team.stats.recentForm} />
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <h2 className="font-display font-semibold mb-4">Roster</h2>
        <ul className="space-y-2 mb-5">
          {team.players.map((p, i) => (
            <li key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5">
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-ink-muted">{p.role} · {p.kd.toFixed(2)} K/D</p>
              </div>
              <button
                onClick={() => removeTeamMember(team.id, i)}
                className="text-ink-muted hover:text-magenta p-1.5 rounded-lg focus-ring"
                aria-label={`Remove ${p.name}`}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddMember} className="grid gap-3 sm:grid-cols-3">
          <TextField
            id="memberName" label="Player name" placeholder="Player name"
            value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })}
          />
          <TextField
            id="memberRole" label="Role" placeholder="e.g. Duelist"
            value={member.role} onChange={(e) => setMember({ ...member, role: e.target.value })}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full"><UserPlus size={16} /> Add Member</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
