import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  RESOLVED: {
    label: 'Resolved',
    color: '#16A34A',
    bg: '#DCFCE7',
  },

  IN_PROGRESS: {
    label: 'In Progress',
    color: '#2563EB',
    bg: '#DBEAFE',
  },

  PENDING: {
    label: 'Pending',
    color: '#D97706',
    bg: '#FEF3C7',
  },

  REJECTED: {
    label: 'Rejected',
    color: '#DC2626',
    bg: '#FEE2E2',
  },
};

const AuthDashboard = () => {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('ALL');

  const [expandedId, setExpandedId] = useState(null);

  const [officerNotes, setOfficerNotes] = useState({});

  // FETCH ISSUES
  const fetchIssues = async () => {

    try {

      const res = await API.get('/issues');

      setIssues(res.data || []);

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
  const updateStatus = async (
    issueId,
    newStatus
  ) => {

    try {

      const formData = new FormData();

      formData.append(
        'status',
        newStatus
      );

      await API.patch(
        `/issues/${issueId}/status`,
        formData
      );

      toast.success(
        `Updated to ${newStatus}`
      );

      fetchIssues();

    } catch {

      toast.error(
        'Failed to update issue'
      );
    }
  };

  // SAVE NOTE
  const saveNote = async (issueId) => {

    try {

      await API.patch(
        `/issues/${issueId}/note`,
        {
          officerNote:
            officerNotes[issueId],
        }
      );

      toast.success(
        'Authority note saved'
      );

    } catch {

      toast.error(
        'Failed to save note'
      );
    }
  };

  // FILTER
  const filtered =
    filterStatus === 'ALL'
      ? issues
      : issues.filter(
          (issue) =>
            issue.status ===
            filterStatus
        );

  // STATS
  const stats = {

    PENDING:
      issues.filter(
        (i) =>
          i.status === 'PENDING'
      ).length,

    IN_PROGRESS:
      issues.filter(
        (i) =>
          i.status ===
          'IN_PROGRESS'
      ).length,

    RESOLVED:
      issues.filter(
        (i) =>
          i.status === 'RESOLVED'
      ).length,

    REJECTED:
      issues.filter(
        (i) =>
          i.status === 'REJECTED'
      ).length,
  };

  // LOADING
  if (loading) {

    return (

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F8FAFC',
          fontFamily:
            "'Inter', sans-serif",
        }}
      >
        <h2
          style={{
            color: '#111827',
          }}
        >
          Loading Dashboard...
        </h2>
      </div>

    );
  }

  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        padding: '40px 24px',
        fontFamily:
          "'Inter', sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >

        {/* HEADER */}

        <div
          style={{
            marginBottom: '40px',
          }}
        >

          <div
            style={{
              color: '#7C3AED',
              fontWeight: '700',
              fontSize: '13px',
              letterSpacing: '0.12em',
              marginBottom: '12px',
              textTransform:
                'uppercase',
            }}
          >
            Authority Control Panel
          </div>

          <h1
            style={{
              color: '#111827',
              fontSize: '52px',
              fontWeight: '800',
              marginBottom: '10px',
            }}
          >
            Authority Dashboard
          </h1>

          <p
            style={{
              color: '#4B5563',
              fontSize: '17px',
              fontWeight: '500',
            }}
          >
            Manage and monitor
            community-reported
            issues efficiently.
          </p>

        </div>

        {/* STATS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4,1fr)',

            gap: '20px',
            marginBottom: '40px',
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

              style={{
                background:
                  '#FFFFFF',

                border:
                  '1px solid #E5E7EB',

                borderRadius:
                  '24px',

                padding: '26px',

                boxShadow:
                  '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >

              <div
                style={{
                  fontSize: '40px',
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
            gap: '12px',
            marginBottom: '30px',
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

              onClick={() =>
                setFilterStatus(
                  status
                )
              }

              style={{
                padding:
                  '12px 20px',

                borderRadius:
                  '999px',

                border: 'none',

                cursor: 'pointer',

                fontWeight: '700',

                background:
                  filterStatus ===
                  status
                    ? '#7C3AED'
                    : '#E5E7EB',

                color:
                  filterStatus ===
                  status
                    ? '#FFFFFF'
                    : '#111827',
              }}
            >
              {status.replace(
                '_',
                ' '
              )}
            </button>

          ))}

        </div>

        {/* ISSUES */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >

          {filtered.map((issue) => {

            const statusStyle =
              STATUS_CONFIG[
                issue.status
              ] ||
              STATUS_CONFIG.PENDING;

            const isExpanded =
              expandedId ===
              issue.id;

            return (

              <div
                key={issue.id}

                style={{
                  background:
                    '#FFFFFF',

                  border:
                    '1px solid #E5E7EB',

                  borderRadius:
                    '26px',

                  overflow:
                    'hidden',

                  boxShadow:
                    '0 4px 18px rgba(0,0,0,0.05)',
                }}
              >

                {/* TOP */}

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

                    justifyContent:
                      'space-between',

                    alignItems:
                      'center',

                    padding:
                      '24px',

                    cursor: 'pointer',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      alignItems:
                        'center',

                      gap: '18px',
                    }}
                  >

                    {/* DOT */}

                    <div
                      style={{
                        width: '14px',
                        height:
                          '14px',

                        borderRadius:
                          '50%',

                        background:
                          statusStyle.color,
                      }}
                    />

                    <div>

                      <div
                        style={{
                          color:
                            '#111827',

                          fontWeight:
                            '800',

                          fontSize:
                            '25px',
                        }}
                      >
                        {issue.title}
                      </div>

                      <div
                        style={{
                          marginTop:
                            '6px',

                          color:
                            '#6B7280',

                          fontSize:
                            '14px',
                        }}
                      >
                        {
                          issue.location
                        }
                        {' • '}
                        {
                          issue.createdByName
                        }
                      </div>

                    </div>

                  </div>

                  {/* BADGE */}

                  <div
                    style={{
                      background:
                        statusStyle.bg,

                      color:
                        statusStyle.color,

                      padding:
                        '9px 16px',

                      borderRadius:
                        '999px',

                      fontWeight:
                        '700',

                      fontSize:
                        '13px',
                    }}
                  >
                    {
                      statusStyle.label
                    }
                  </div>

                </div>

                {/* EXPANDED */}

                {isExpanded && (

                  <div
                    style={{
                      padding:
                        '0 24px 24px 24px',
                    }}
                  >

                    {/* IMAGE */}

                    {issue.imageUrl && (

                      <img
                        src={`http://localhost:8080${issue.imageUrl}`}

                        alt={
                          issue.title
                        }

                        style={{
                          width:
                            '100%',

                          maxHeight:
                            '300px',

                          objectFit:
                            'cover',

                          borderRadius:
                            '18px',

                          marginBottom:
                            '20px',
                        }}
                      />

                    )}

                    {/* DESCRIPTION */}

                    <div
                      style={{
                        color:
                          '#374151',

                        lineHeight:
                          '1.8',

                        fontSize:
                          '15px',

                        marginBottom:
                          '24px',
                      }}
                    >
                      {
                        issue.description
                      }
                    </div>

                    {/* NOTE */}

                    <div
                      style={{
                        marginBottom:
                          '24px',
                      }}
                    >

                      <div
                        style={{
                          color:
                            '#7C3AED',

                          fontWeight:
                            '700',

                          marginBottom:
                            '10px',
                        }}
                      >
                        Authority Note
                      </div>

                      <textarea
                        rows={4}

                        value={
                          officerNotes[
                            issue.id
                          ] || ''
                        }

                        onChange={(
                          e
                        ) =>
                          setOfficerNotes(
                            (
                              prev
                            ) => ({
                              ...prev,

                              [issue.id]:
                                e.target
                                  .value,
                            })
                          )
                        }

                        placeholder="Write official authority response..."

                        style={{
                          width:
                            '100%',

                          padding:
                            '16px',

                          border:
                            '1px solid #D1D5DB',

                          borderRadius:
                            '16px',

                          outline:
                            'none',

                          resize:
                            'vertical',

                          fontSize:
                            '15px',

                          color:
                            '#111827',

                          background:
                            '#FFFFFF',
                        }}
                      />

                      <button
                        onClick={() =>
                          saveNote(
                            issue.id
                          )
                        }

                        style={{
                          marginTop:
                            '14px',

                          background:
                            '#7C3AED',

                          color:
                            '#FFFFFF',

                          border:
                            'none',

                          padding:
                            '12px 18px',

                          borderRadius:
                            '14px',

                          fontWeight:
                            '700',

                          cursor:
                            'pointer',
                        }}
                      >
                        Save Note
                      </button>

                    </div>

                    {/* STATUS BUTTONS */}

                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap:
                          'wrap',
                      }}
                    >

                      {Object.keys(
                        STATUS_CONFIG
                      ).map(
                        (
                          status
                        ) => {

                          const s =
                            STATUS_CONFIG[
                              status
                            ];

                          return (

                            <button
                              key={
                                status
                              }

                              onClick={() =>
                                updateStatus(
                                  issue.id,
                                  status
                                )
                              }

                              style={{
                                background:
                                  s.bg,

                                color:
                                  s.color,

                                border:
                                  'none',

                                padding:
                                  '11px 16px',

                                borderRadius:
                                  '12px',

                                fontWeight:
                                  '700',

                                cursor:
                                  'pointer',
                              }}
                            >
                              {
                                s.label
                              }
                            </button>

                          );
                        }
                      )}

                    </div>

                  </div>

                )}

              </div>

            );
          })}

        </div>

      </div>

    </div>
  );
};

export default AuthDashboard;