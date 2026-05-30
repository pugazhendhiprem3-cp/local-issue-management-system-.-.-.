import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  RESOLVED: {
    label: 'Resolved',
    color: '#22C55E',
    accent: '#16A34A',
    bg: '#DCFCE7',
  },

  IN_PROGRESS: {
    label: 'In Progress',
    color: '#3B82F6',
    accent: '#2563EB',
    bg: '#DBEAFE',
  },

  PENDING: {
    label: 'Pending',
    color: '#F59E0B',
    accent: '#D97706',
    bg: '#FEF3C7',
  },

  REJECTED: {
    label: 'Rejected',
    color: '#EF4444',
    accent: '#DC2626',
    bg: '#FEE2E2',
  },
};

const AuthDashboard = () => {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('ALL');

  const [officerNotes, setOfficerNotes] = useState({});

  const [expandedId, setExpandedId] = useState(null);

  const font = {
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  };

  // FETCH ISSUES
  const fetchIssues = async () => {

    try {

      const res = await API.get('/issues');

      const data = res.data || [];

      setIssues(data);

      const notes = {};

      data.forEach((issue) => {

        if (issue.officerNote) {
          notes[issue.id] = issue.officerNote;
        }

      });

      setOfficerNotes((prev) => ({
        ...notes,
        ...prev
      }));

    } catch {

      toast.error('Failed to load issues');

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // UPDATE STATUS
  const updateStatus = async (issueId, newStatus) => {

    try {

      const note = officerNotes[issueId] || '';

      const formData = new FormData();

      formData.append('status', newStatus);

      await API.patch(
        `/issues/${issueId}/status`,
        formData
      );

      if (note.trim()) {

        await API.patch(
          `/issues/${issueId}/note`,
          { officerNote: note }
        );
      }

      toast.success(
        `Status updated to ${newStatus.replace('_', ' ')}`
      );

      fetchIssues();

    } catch {

      toast.error('Failed to update issue');
    }
  };

  // SAVE NOTE
  const saveNote = async (issueId) => {

    const note = officerNotes[issueId] || '';

    if (!note.trim()) {
      return toast.error('Note cannot be empty');
    }

    try {

      await API.patch(
        `/issues/${issueId}/note`,
        { officerNote: note }
      );

      toast.success('Authority note saved');

      fetchIssues();

    } catch {

      toast.error('Failed to save note');
    }
  };

  // FILTER
  const filtered =
    filterStatus === 'ALL'
      ? issues
      : issues.filter(
          (issue) => issue.status === filterStatus
        );

  // STATS
  const stats = {
    PENDING:
      issues.filter(
        (issue) => issue.status === 'PENDING'
      ).length,

    IN_PROGRESS:
      issues.filter(
        (issue) => issue.status === 'IN_PROGRESS'
      ).length,

    RESOLVED:
      issues.filter(
        (issue) => issue.status === 'RESOLVED'
      ).length,

    REJECTED:
      issues.filter(
        (issue) => issue.status === 'REJECTED'
      ).length,
  };

  // LOADING
  if (loading) {

    return (

      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
        }}
      >

        <div
          style={{
            ...font,
            color: '#6B7280',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Loading dashboard...
        </div>

      </div>
    );
  }

  return (

    <div
      style={{
        maxWidth: '1150px',
        margin: '0 auto',
        padding: '40px 24px',
        background: '#F8FAFC',
        minHeight: '100vh',
        ...font,
      }}
    >

      <style>{`

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .issue-row {
          animation: fadeIn 0.35s ease both;
          transition: 0.2s;
        }

        .issue-row:hover {
          transform: translateY(-2px);
        }

        .status-btn {
          transition: all 0.15s;
        }

        .status-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

      `}</style>

      {/* HEADER */}

      <div style={{ marginBottom: '36px' }}>

        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            color: '#7C3AED',
            marginBottom: '10px',
            textTransform: 'uppercase',
            fontWeight: '700',
          }}
        >
          Authority Management Panel
        </div>

        <h1
          style={{
            fontWeight: '800',
            fontSize: '42px',
            color: '#111827',
            margin: 0,
          }}
        >
          Authority Dashboard
        </h1>

        <p
          style={{
            color: '#6B7280',
            fontSize: '16px',
            marginTop: '8px',
          }}
        >
          Review and manage all reported community issues.
        </p>

      </div>

      {/* STATS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '36px',
        }}
      >

        {[
          {
            key: 'PENDING',
            label: 'Pending',
            color: '#F59E0B',
          },

          {
            key: 'IN_PROGRESS',
            label: 'In Progress',
            color: '#3B82F6',
          },

          {
            key: 'RESOLVED',
            label: 'Resolved',
            color: '#22C55E',
          },

          {
            key: 'REJECTED',
            label: 'Rejected',
            color: '#EF4444',
          },

        ].map((stat) => (

          <div
            key={stat.key}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >

            <div
              style={{
                fontSize: '34px',
                fontWeight: '800',
                color: stat.color,
              }}
            >
              {stats[stat.key]}
            </div>

            <div
              style={{
                fontSize: '14px',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '600',
              }}
            >
              {stat.label}
            </div>

          </div>

        ))}

      </div>

      {/* FILTERS */}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >

        {[
          'ALL',
          'PENDING',
          'IN_PROGRESS',
          'RESOLVED',
          'REJECTED',
        ].map((status) => (

          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',

              background:
                filterStatus === status
                  ? '#7C3AED'
                  : '#E5E7EB',

              color:
                filterStatus === status
                  ? '#FFFFFF'
                  : '#374151',
            }}
          >

            {status.replace('_', ' ')}

            {status !== 'ALL' &&
              ` (${stats[status]})`}

          </button>

        ))}

      </div>

      {/* ISSUE LIST */}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >

        {filtered.map((issue, idx) => {

          const sc =
            STATUS_CONFIG[issue.status] ||
            STATUS_CONFIG.PENDING;

          const isExpanded =
            expandedId === issue.id;

          return (

            <div
              key={issue.id}
              className="issue-row"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow:
                  '0 4px 20px rgba(0,0,0,0.04)',

                animationDelay:
                  `${idx * 0.04}s`,
              }}
            >

              {/* HEADER */}

              <div
                onClick={() =>
                  setExpandedId(
                    isExpanded
                      ? null
                      : issue.id
                  )
                }
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  cursor: 'pointer',

                  borderBottom:
                    isExpanded
                      ? '1px solid #E5E7EB'
                      : 'none',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flex: 1,
                  }}
                >

                  {/* STATUS DOT */}

                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: sc.color,
                      boxShadow:
                        `0 0 10px ${sc.color}`,
                    }}
                  />

                  <div>

                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '20px',
                        color: '#111827',
                      }}
                    >
                      {issue.title}
                    </div>

                    <div
                      style={{
                        color: '#6B7280',
                        fontSize: '14px',
                        marginTop: '4px',
                      }}
                    >
                      {issue.createdByName || 'Anonymous'}
                      {' • '}
                      {issue.location}
                    </div>

                  </div>

                </div>

                {/* STATUS */}

                <div
                  style={{
                    background: sc.bg,
                    color: sc.accent,
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontWeight: '700',
                    fontSize: '13px',
                  }}
                >
                  {sc.label}
                </div>

              </div>

              {/* EXPANDED */}

              {isExpanded && (

                <div
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >

                  {/* IMAGE + INFO */}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        issue.imageUrl
                          ? '260px 1fr'
                          : '1fr',

                      gap: '24px',
                    }}
                  >

                    {issue.imageUrl && (

                      <img
                        src={`http://localhost:8080${issue.imageUrl}`}
                        alt={issue.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          borderRadius: '18px',
                        }}
                      />

                    )}

                    <div>

                      <p
                        style={{
                          color: '#4B5563',
                          lineHeight: '1.8',
                          fontSize: '15px',
                        }}
                      >
                        {issue.description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          gap: '24px',
                          flexWrap: 'wrap',
                          marginTop: '18px',
                        }}
                      >

                        <InfoItem
                          label="Location"
                          value={issue.location}
                        />

                        <InfoItem
                          label="Category"
                          value={issue.category}
                        />

                        <InfoItem
                          label="Reported By"
                          value={
                            issue.createdByName ||
                            'Anonymous'
                          }
                        />

                      </div>

                    </div>

                  </div>

                  {/* NOTE BOX */}

                  <div
                    style={{
                      background: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '18px',
                      padding: '20px',
                    }}
                  >

                    <div
                      style={{
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: '#7C3AED',
                      }}
                    >
                      Authority Response
                    </div>

                    <textarea
                      rows={4}
                      placeholder="Write official response..."
                      value={
                        officerNotes[issue.id] || ''
                      }

                      onChange={(e) =>
                        setOfficerNotes((prev) => ({
                          ...prev,
                          [issue.id]:
                            e.target.value,
                        }))
                      }

                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        border:
                          '1px solid #D1D5DB',

                        resize: 'vertical',
                        fontSize: '14px',
                        color: '#111827',
                        lineHeight: '1.7',
                      }}
                    />

                    <button
                      onClick={() =>
                        saveNote(issue.id)
                      }

                      style={{
                        marginTop: '14px',
                        background: '#7C3AED',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        cursor: 'pointer',
                        fontWeight: '700',
                      }}
                    >
                      Save Note
                    </button>

                  </div>

                  {/* STATUS BUTTONS */}

                  <div>

                    <div
                      style={{
                        marginBottom: '12px',
                        color: '#6B7280',
                        fontWeight: '600',
                      }}
                    >
                      Update Status
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >

                      {[
                        {
                          status: 'PENDING',
                          label: 'Pending',
                          bg: '#FEF3C7',
                          color: '#B45309',
                        },

                        {
                          status: 'IN_PROGRESS',
                          label: 'In Progress',
                          bg: '#DBEAFE',
                          color: '#1D4ED8',
                        },

                        {
                          status: 'RESOLVED',
                          label: 'Resolved',
                          bg: '#DCFCE7',
                          color: '#166534',
                        },

                        {
                          status: 'REJECTED',
                          label: 'Rejected',
                          bg: '#FEE2E2',
                          color: '#B91C1C',
                        },

                      ].map((btn) => (

                        <button
                          key={btn.status}
                          className="status-btn"

                          onClick={() =>
                            updateStatus(
                              issue.id,
                              btn.status
                            )
                          }

                          style={{
                            padding: '10px 18px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '700',

                            background: btn.bg,
                            color: btn.color,
                          }}
                        >
                          {btn.label}
                        </button>

                      ))}

                    </div>

                  </div>

                </div>

              )}

            </div>

          );
        })}

      </div>

      {/* EMPTY */}

      {filtered.length === 0 && (

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '20px',
            padding: '70px',
            textAlign: 'center',
            color: '#6B7280',
            marginTop: '20px',
          }}
        >
          No reports found.
        </div>

      )}

    </div>
  );
};

// SMALL INFO COMPONENT

const InfoItem = ({ label, value }) => (

  <div>

    <div
      style={{
        fontSize: '12px',
        color: '#9CA3AF',
        marginBottom: '4px',
        fontWeight: '600',
      }}
    >
      {label}
    </div>

    <div
      style={{
        color: '#111827',
        fontWeight: '600',
      }}
    >
      {value || '—'}
    </div>

  </div>
);

export default AuthDashboard;