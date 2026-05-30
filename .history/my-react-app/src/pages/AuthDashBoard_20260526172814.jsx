import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  RESOLVED: {
    label: 'Resolved',
    color: '#22C55E',
    bg: '#DCFCE7',
    border: '#BBF7D0',
  },

  IN_PROGRESS: {
    label: 'In Progress',
    color: '#2563EB',
    bg: '#DBEAFE',
    border: '#BFDBFE',
  },

  PENDING: {
    label: 'Pending',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FDE68A',
  },

  REJECTED: {
    label: 'Rejected',
    color: '#DC2626',
    bg: '#FEE2E2',
    border: '#FECACA',
  },
};

const AuthDashboard = () => {

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('ALL');

  const [officerNotes, setOfficerNotes] = useState({});

  const [expandedId, setExpandedId] = useState(null);

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
        ...prev,
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

  if (loading) {

    return (

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F8FAFC',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          style={{
            color: '#6B7280',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Loading Authority Dashboard...
        </div>
      </div>

    );
  }

  return (

    <div
      style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        padding: '40px 24px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
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

        .dashboard-card {
          animation: fadeIn 0.35s ease both;
          transition: 0.2s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-3px);
        }

        .status-button {
          transition: 0.2s ease;
        }

        .status-button:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

      `}</style>

      <div
        style={{
          maxWidth: '1150px',
          margin: '0 auto',
        }}
      >

        {/* HEADER */}

        <div style={{ marginBottom: '40px' }}>

          <div
            style={{
              color: '#7C3AED',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Authority Control Center
          </div>

          <h1
            style={{
              fontSize: '46px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '10px',
            }}
          >
            Authority Dashboard
          </h1>

          <p
            style={{
              color: '#6B7280',
              fontSize: '16px',
            }}
          >
            Manage and monitor all community-reported civic issues.
          </p>

        </div>

        {/* STATS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px',
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
              color: '#2563EB',
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
              className="dashboard-card"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '24px',
                padding: '24px',
                boxShadow:
                  '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >

              <div
                style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: stat.color,
                }}
              >
                {stats[stat.key]}
              </div>

              <div
                style={{
                  marginTop: '8px',
                  color: '#6B7280',
                  fontWeight: '600',
                  fontSize: '15px',
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
            flexWrap: 'wrap',
            marginBottom: '30px',
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
                padding: '11px 18px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',

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
            gap: '20px',
          }}
        >

          {filtered.map((issue, idx) => {

            const statusConfig =
              STATUS_CONFIG[issue.status] ||
              STATUS_CONFIG.PENDING;

            const isExpanded =
              expandedId === issue.id;

            return (

              <div
                key={issue.id}
                className="dashboard-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow:
                    '0 4px 20px rgba(0,0,0,0.04)',

                  animationDelay:
                    `${idx * 0.04}s`,
                }}
              >

                {/* COLLAPSED HEADER */}

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
                    padding: '22px 24px',
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
                        background: statusConfig.color,
                        boxShadow:
                          `0 0 12px ${statusConfig.color}`,
                      }}
                    />

                    <div>

                      <div
                        style={{
                          color: '#111827',
                          fontWeight: '700',
                          fontSize: '22px',
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
                        {' • '}
                        {issue.createdAt
                          ? new Date(
                              issue.createdAt
                            ).toLocaleDateString()
                          : 'Unknown'}
                      </div>

                    </div>

                  </div>

                  {/* STATUS BADGE */}

                  <div
                    style={{
                      background: statusConfig.bg,
                      color: statusConfig.color,
                      border:
                        `1px solid ${statusConfig.border}`,

                      padding: '8px 14px',
                      borderRadius: '999px',
                      fontWeight: '700',
                      fontSize: '13px',
                    }}
                  >
                    {statusConfig.label}
                  </div>

                </div>

                {/* EXPANDED BODY */}

                {isExpanded && (

                  <div
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                    }}
                  >

                    {/* IMAGE + DETAILS */}

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
                            gap: '26px',
                            flexWrap: 'wrap',
                            marginTop: '20px',
                          }}
                        >

                          <InfoCard
                            label="Location"
                            value={issue.location}
                          />

                          <InfoCard
                            label="Category"
                            value={issue.category}
                          />

                          <InfoCard
                            label="Reported By"
                            value={
                              issue.createdByName ||
                              'Anonymous'
                            }
                          />

                        </div>

                      </div>

                    </div>

                    {/* AUTHORITY NOTE */}

                    <div
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: '20px',
                        padding: '20px',
                      }}
                    >

                      <div
                        style={{
                          color: '#7C3AED',
                          fontWeight: '700',
                          marginBottom: '12px',
                        }}
                      >
                        Authority Response
                      </div>

                      <textarea
                        rows={4}

                        placeholder="Write official authority response..."

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
                            className="status-button"

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
              marginTop: '20px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '24px',
              padding: '70px',
              textAlign: 'center',
              color: '#6B7280',
            }}
          >
            No reports found.
          </div>

        )}

      </div>

    </div>
  );
};

// INFO CARD

const InfoCard = ({ label, value }) => (

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
        fontWeight: '700',
      }}
    >
      {value || '—'}
    </div>

  </div>
);

export default AuthDashboard;