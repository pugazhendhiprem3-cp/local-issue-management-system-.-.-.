import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  RESOLVED:    { label: 'Resolved',    color: '#4ade80', accent: '#16a34a' },
  IN_PROGRESS: { label: 'In Progress', color: '#fbbf24', accent: '#d97706' },
  PENDING:     { label: 'Pending',     color: '#fb923c', accent: '#ea580c' },
  REJECTED:    { label: 'Rejected',    color: '#f87171', accent: '#dc2626' },
};

const AuthDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  // Per-issue officer note state: { [issueId]: string }
  const [officerNotes, setOfficerNotes] = useState({});
  // Track which cards are expanded
  const [expandedId, setExpandedId] = useState(null);

  const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

  const fetchIssues = async () => {
    try {
      const res = await API.get('/issues');
      const data = res.data || [];
      setIssues(data);
      // Pre-fill notes from existing officerNote field
      const notes = {};
      data.forEach(i => { if (i.officerNote) notes[i.id] = i.officerNote; });
      setOfficerNotes(prev => ({ ...notes, ...prev }));
    } catch {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  // Update status + optional officer note together
  const updateStatus = async (issueId, newStatus) => {
    try {
      const note = officerNotes[issueId] || '';

      // Send status update
      const formData = new FormData();
      formData.append('status', newStatus);
      await API.patch(`/issues/${issueId}/status`, formData);

      // Send officer note if provided
      if (note.trim()) {
        await API.patch(`/issues/${issueId}/note`, { officerNote: note });
      }

      toast.success(`Status set to ${newStatus.replace('_', ' ')}`);
      fetchIssues();
    } catch {
      toast.error('Failed to update issue');
    }
  };

  // Save note independently
  const saveNote = async (issueId) => {
    const note = officerNotes[issueId] || '';
    if (!note.trim()) return toast.error('Note cannot be empty');
    try {
      await API.patch(`/issues/${issueId}/note`, { officerNote: note });
      toast.success('Authority note saved');
      fetchIssues();
    } catch {
      toast.error('Failed to save note');
    }
  };

  const filtered = filterStatus === 'ALL' ? issues : issues.filter(i => i.status === filterStatus);

  // Stats
  const stats = {
    PENDING:     issues.filter(i => i.status === 'PENDING').length,
    IN_PROGRESS: issues.filter(i => i.status === 'IN_PROGRESS').length,
    RESOLVED:    issues.filter(i => i.status === 'RESOLVED').length,
    REJECTED:    issues.filter(i => i.status === 'REJECTED').length,
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...mono, color: '#d97706', fontSize: '13px', letterSpacing: '0.15em' }}>
        LOADING AUTHORITY PANEL...
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .issue-row { animation: fadeIn 0.35s ease both; transition: border-color 0.2s; }
        .issue-row:hover { border-color: rgba(217,119,6,0.3) !important; }
        .status-btn { transition: all 0.15s !important; }
        .status-btn:hover { opacity: 0.85 !important; transform: translateY(-1px) !important; }
        textarea:focus, input:focus { outline: 1px solid rgba(217,119,6,0.5) !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', color: '#d97706', marginBottom: '10px', textTransform: 'uppercase' }}>
          ▸ Restricted Access — Officer Panel
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '32px', color: '#f5f0e8', margin: 0, letterSpacing: '-0.5px' }}>
          Authority Dashboard
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '14px', marginTop: '6px' }}>
          Review, respond, and update the status of all citizen-reported issues.
        </p>
      </div>

      {/* MINI STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { key: 'PENDING',     label: 'Pending',     color: '#fb923c' },
          { key: 'IN_PROGRESS', label: 'In Progress', color: '#fbbf24' },
          { key: 'RESOLVED',    label: 'Resolved',    color: '#4ade80' },
          { key: 'REJECTED',    label: 'Rejected',    color: '#f87171' },
        ].map(s => (
          <div key={s.key} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px', padding: '16px 18px',
          }}>
            <div style={{ ...mono, fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {stats[s.key]}
            </div>
            <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(245,240,232,0.35)', marginTop: '6px', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            ...mono, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '7px 14px', borderRadius: '3px', cursor: 'pointer', transition: 'all 0.15s',
            background: filterStatus === s ? '#d97706' : 'transparent',
            border: filterStatus === s ? '1px solid #d97706' : '1px solid rgba(255,255,255,0.1)',
            color: filterStatus === s ? '#0d0d0d' : 'rgba(245,240,232,0.45)',
            fontWeight: filterStatus === s ? 700 : 400,
          }}>
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            {s !== 'ALL' && ` (${stats[s]})`}
          </button>
        ))}
      </div>

      {/* ISSUE LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((issue, idx) => {
          const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG.PENDING;
          const isExpanded = expandedId === issue.id;

          return (
            <div key={issue.id} className="issue-row" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px', overflow: 'hidden',
              animationDelay: `${idx * 0.04}s`,
            }}>

              {/* ── COLLAPSED HEADER ── */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', cursor: 'pointer',
                  borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                  {/* Status dot */}
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.color, flexShrink: 0, boxShadow: `0 0 6px ${sc.color}` }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', color: '#f5f0e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {issue.title}
                    </div>
                    <div style={{ ...mono, fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: '2px' }}>
                      {issue.createdByName || 'Anonymous'} · {issue.location} · {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{
                    ...mono, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: '2px',
                    background: `${sc.color}18`, color: sc.color, border: `1px solid ${sc.color}40`,
                  }}>
                    {sc.label}
                  </span>
                  <span style={{ ...mono, fontSize: '14px', color: 'rgba(245,240,232,0.3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>
              </div>

              {/* ── EXPANDED BODY ── */}
              {isExpanded && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* IMAGE + DETAILS SIDE BY SIDE */}
                  <div style={{ display: 'grid', gridTemplateColumns: issue.imageUrl ? '240px 1fr' : '1fr', gap: '20px' }}>
                    {issue.imageUrl && (
                      <img
                        src={`http://localhost:8080${issue.imageUrl}`}
                        alt={issue.title}
                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.6)', lineHeight: 1.7, margin: 0 }}>
                        {issue.description}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {[
                          ['📍 Location', issue.location],
                          ['📂 Category', issue.category],
                          ['👤 Reported by', issue.createdByName || 'Anonymous'],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div style={{ ...mono, fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase', marginBottom: '3px' }}>{k}</div>
                            <div style={{ ...mono, fontSize: '12px', color: 'rgba(245,240,232,0.7)' }}>{v || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* OFFICER NOTE BOX */}
                  <div style={{
                    background: 'rgba(217,119,6,0.05)',
                    border: '1px solid rgba(217,119,6,0.2)',
                    borderRadius: '4px', padding: '16px',
                  }}>
                    <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#d97706', marginBottom: '10px', textTransform: 'uppercase' }}>
                      ▸ Authority Response / Officer Note
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Write an official response or update for this report... e.g. 'Our team has been dispatched and will inspect the site by Thursday. Citizens are advised to avoid the area until further notice.'"
                      value={officerNotes[issue.id] || ''}
                      onChange={e => setOfficerNotes(prev => ({ ...prev, [issue.id]: e.target.value }))}
                      style={{
                        width: '100%', ...mono, fontSize: '13px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '3px', padding: '10px 12px',
                        color: '#f5f0e8', resize: 'vertical', lineHeight: 1.6,
                        transition: 'outline 0.15s',
                      }}
                    />
                    <button
                      onClick={() => saveNote(issue.id)}
                      style={{
                        ...mono, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                        marginTop: '8px', padding: '8px 18px', borderRadius: '3px', cursor: 'pointer',
                        background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.4)',
                        color: '#fbbf24', fontWeight: 700, transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(217,119,6,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(217,119,6,0.15)'}
                    >
                      ✓ Save Note
                    </button>
                  </div>

                  {/* STATUS BUTTONS */}
                  <div>
                    <div style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(245,240,232,0.35)', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Update Status
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {[
                        { status: 'PENDING',     label: 'Set Pending',     bg: 'rgba(234,88,12,0.12)',  border: 'rgba(234,88,12,0.35)',  color: '#fb923c' },
                        { status: 'IN_PROGRESS', label: 'In Progress',     bg: 'rgba(217,119,6,0.12)',  border: 'rgba(217,119,6,0.35)',  color: '#fbbf24' },
                        { status: 'RESOLVED',    label: 'Mark Resolved',   bg: 'rgba(22,163,74,0.12)',  border: 'rgba(22,163,74,0.35)',  color: '#4ade80' },
                        { status: 'REJECTED',    label: 'Reject',          bg: 'rgba(220,38,38,0.12)',  border: 'rgba(220,38,38,0.35)',  color: '#f87171' },
                      ].map(btn => (
                        <button key={btn.status} className="status-btn" onClick={() => updateStatus(issue.id, btn.status)} style={{
                          ...mono, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '10px 20px', borderRadius: '3px', cursor: 'pointer',
                          background: issue.status === btn.status ? btn.border : btn.bg,
                          border: `1px solid ${btn.border}`, color: btn.color,
                          fontWeight: issue.status === btn.status ? 700 : 400,
                          outline: issue.status === btn.status ? `1px solid ${btn.color}` : 'none',
                          outlineOffset: '2px',
                        }}>
                          {issue.status === btn.status ? '● ' : ''}{btn.label}
                        </button>
                      ))}
                    </div>
                    <p style={{ ...mono, fontSize: '11px', color: 'rgba(245,240,232,0.25)', marginTop: '10px' }}>
                      Note will be saved along with the status update.
                    </p>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px',
          padding: '64px', textAlign: 'center',
          ...mono, color: 'rgba(245,240,232,0.25)', fontSize: '13px', letterSpacing: '0.1em',
        }}>
          NO REPORTS IN THIS CATEGORY
        </div>
      )}
    </div>
  );
};

export default AuthDashboard;