import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
  ROAD: '🛣️', WATER: '💧', ELECTRICAL: '⚡', GARBAGE: '🗑️',
  DRAINAGE: '🌊', STREET_LIGHT: '💡', SEWAGE: '🚰', PARK: '🌳', OTHER: '📌',
};

const STATUS_CONFIG = {
  RESOLVED:    { label: 'Resolved',    color: '#4ade80', bg: 'rgba(22,163,74,0.12)',  border: 'rgba(22,163,74,0.3)'  },
  IN_PROGRESS: { label: 'In Progress', color: '#fbbf24', bg: 'rgba(217,119,6,0.12)',  border: 'rgba(217,119,6,0.3)'  },
  PENDING:     { label: 'Pending',     color: '#fb923c', bg: 'rgba(234,88,12,0.12)',  border: 'rgba(234,88,12,0.3)'  },
  REJECTED:    { label: 'Rejected',    color: '#f87171', bg: 'rgba(220,38,38,0.12)',  border: 'rgba(220,38,38,0.3)'  },
};

const IssuesFeed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', location: '', category: '' });
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Current user identity
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const isAuthenticated = !!localStorage.getItem('token');

  const fetchIssues = () => {
    API.get('/issues')
      .then(res => { setIssues(res.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load issues'); setLoading(false); });
  };

  useEffect(() => { fetchIssues(); }, []);

  // ── Ownership check: user can only edit/delete their own issues
  const isOwner = (issue) => {
    if (!isAuthenticated) return false;
    if (role === 'ADMIN') return false; // admin manages via Authority Dashboard
    return (
      issue.userId === currentUserId ||
      issue.createdByName === currentUsername ||
      issue.createdBy === currentUserId
    );
  };

  const deleteIssue = async (issueId) => {
    if (!window.confirm('Delete this issue? This cannot be undone.')) return;
    try {
      await API.delete(`/issues/${issueId}`);
      setIssues(issues.filter(i => i.id !== issueId));
      toast.success('Issue deleted');
    } catch {
      toast.error('Failed to delete issue');
    }
  };

  const startEdit = (issue) => {
    setEditingIssueId(issue.id);
    setEditForm({
      title: issue.title || '',
      description: issue.description || '',
      location: issue.location || '',
      category: issue.category || '',
    });
  };

  const saveEdit = async (issueId) => {
    try {
      await API.put(`/issues/${issueId}`, editForm);
      setEditingIssueId(null);
      fetchIssues();
      toast.success('Issue updated');
    } catch {
      toast.error('Failed to update issue');
    }
  };

  const filtered = filterStatus === 'ALL'
    ? issues
    : issues.filter(i => i.status === filterStatus);

  const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...mono, color: '#d97706', fontSize: '13px', letterSpacing: '0.15em' }}>
        FETCHING REPORTS...
        <span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .issue-card { animation: fadeIn 0.4s ease both; }
        .issue-card:hover { border-color: rgba(217,119,6,0.35) !important; }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .filter-btn:hover { border-color: rgba(217,119,6,0.5) !important; color: #f5f0e8 !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#d97706', marginBottom: '10px', textTransform: 'uppercase' }}>
          ▸ Community Reports — Live Feed
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '32px', color: '#f5f0e8', margin: 0, letterSpacing: '-0.5px' }}>
          Issues Feed
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '14px', marginTop: '6px' }}>
          {issues.length} total reports · updated live
        </p>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(s => (
          <button key={s} className="filter-btn" onClick={() => setFilterStatus(s)} style={{
            ...mono, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '7px 14px', borderRadius: '3px', cursor: 'pointer', transition: 'all 0.15s',
            background: filterStatus === s ? '#d97706' : 'transparent',
            border: filterStatus === s ? '1px solid #d97706' : '1px solid rgba(255,255,255,0.1)',
            color: filterStatus === s ? '#0d0d0d' : 'rgba(245,240,232,0.45)',
            fontWeight: filterStatus === s ? 700 : 400,
          }}>
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div style={{
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px',
          padding: '64px', textAlign: 'center',
          ...mono, color: 'rgba(245,240,232,0.25)', fontSize: '13px', letterSpacing: '0.1em',
        }}>
          NO REPORTS FOUND
        </div>
      )}

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((issue, idx) => {
          const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG.PENDING;
          const canModify = isOwner(issue);

          return (
            <div key={issue.id} className="issue-card" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'border-color 0.2s',
              animationDelay: `${idx * 0.05}s`,
            }}>

              {/* IMAGE */}
              {issue.imageUrl ? (
                <img
                  src={`http://localhost:8080${issue.imageUrl}`}
                  alt={issue.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '180px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...mono, fontSize: '11px', color: 'rgba(245,240,232,0.2)', letterSpacing: '0.1em',
                }}>
                  NO IMAGE ATTACHED
                </div>
              )}

              {/* BODY */}
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {editingIssueId === issue.id ? (
                  /* ── EDIT MODE ── */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['title', 'description', 'location'].map(field => (
                      field === 'description'
                        ? <textarea key={field} name={field} value={editForm[field]} onChange={e => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            rows={3} style={{ ...mono, fontSize: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', padding: '8px 10px', color: '#f5f0e8', resize: 'vertical', outline: 'none' }} />
                        : <input key={field} type="text" name={field} value={editForm[field]} onChange={e => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            style={{ ...mono, fontSize: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', padding: '8px 10px', color: '#f5f0e8', outline: 'none' }} />
                    ))}
                    <select name="category" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      style={{ ...mono, fontSize: '12px', background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', padding: '8px 10px', color: '#f5f0e8', outline: 'none' }}>
                      <option value="">Select Category</option>
                      {['ROAD','WATER','ELECTRICAL','GARBAGE','DRAINAGE','STREET_LIGHT','SEWAGE','PARK','OTHER'].map(c =>
                        <option key={c} value={c}>{c.replace('_', ' ')}</option>
                      )}
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="action-btn" onClick={() => saveEdit(issue.id)} style={{ ...mono, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: '#16a34a', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '3px', cursor: 'pointer', flex: 1, transition: 'all 0.15s' }}>Save</button>
                      <button className="action-btn" onClick={() => setEditingIssueId(null)} style={{ ...mono, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.07)', border: 'none', color: '#f5f0e8', padding: '8px 16px', borderRadius: '3px', cursor: 'pointer', flex: 1, transition: 'all 0.15s' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* ── VIEW MODE ── */}
                    {/* TOP ROW */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ ...mono, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>
                        {CATEGORY_ICONS[issue.category] || '📌'} {issue.category || 'General'}
                      </span>
                      <span style={{
                        ...mono, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '3px 10px', borderRadius: '2px',
                        background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                      }}>
                        {sc.label}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '17px', color: '#f5f0e8', margin: 0, lineHeight: 1.3 }}>
                      {issue.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.5)', lineHeight: 1.65, margin: 0 }}>
                      {issue.description}
                    </p>

                    {/* AUTHORITY NOTE (if present) */}
                    {issue.officerNote && (
                      <div style={{
                        background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.2)',
                        borderRadius: '3px', padding: '10px 12px',
                      }}>
                        <div style={{ ...mono, fontSize: '9px', letterSpacing: '0.15em', color: '#d97706', marginBottom: '5px', textTransform: 'uppercase' }}>
                          ▸ Authority Note
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.65)', margin: 0, lineHeight: 1.6 }}>
                          {issue.officerNote}
                        </p>
                      </div>
                    )}

                    {/* FOOTER */}
                    <div style={{ ...mono, fontSize: '11px', color: 'rgba(245,240,232,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>📍 {issue.location}</span>
                        <span>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                      <span>By <span style={{ color: 'rgba(245,240,232,0.55)' }}>{issue.createdByName || 'Anonymous'}</span></span>
                    </div>

                    {/* ACTION BUTTONS — only for issue owner */}
                    {canModify && (
                      <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                        <button className="action-btn" onClick={() => startEdit(issue)} style={{
                          ...mono, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                          flex: 1, padding: '8px', borderRadius: '3px', cursor: 'pointer',
                          background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)',
                          color: '#60a5fa', transition: 'all 0.15s',
                        }}>✏ Edit</button>
                        <button className="action-btn" onClick={() => deleteIssue(issue.id)} style={{
                          ...mono, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                          flex: 1, padding: '8px', borderRadius: '3px', cursor: 'pointer',
                          background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
                          color: '#f87171', transition: 'all 0.15s',
                        }}>🗑 Delete</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssuesFeed;