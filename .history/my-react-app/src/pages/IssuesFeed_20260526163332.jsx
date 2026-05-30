import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
  ROAD: '🛣️',
  WATER: '💧',
  ELECTRICAL: '⚡',
  GARBAGE: '🗑️',
  DRAINAGE: '🌊',
  STREET_LIGHT: '💡',
  SEWAGE: '🚰',
  PARK: '🌳',
  OTHER: '📌',
};

const STATUS_CONFIG = {
  RESOLVED: {
    label: 'Resolved',
    bg: '#DCFCE7',
    color: '#166534',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: '#DBEAFE',
    color: '#1D4ED8',
  },
  PENDING: {
    label: 'Pending',
    bg: '#FEF3C7',
    color: '#B45309',
  },
  REJECTED: {
    label: 'Rejected',
    bg: '#FEE2E2',
    color: '#B91C1C',
  },
};

const IssuesFeed = () => {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingIssueId, setEditingIssueId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
  });

  const [filterStatus, setFilterStatus] = useState('ALL');

  // AUTH
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const isAuthenticated = !!localStorage.getItem('token');

  // FETCH ISSUES
  const fetchIssues = () => {

    API.get('/issues')
      .then((res) => {

        setIssues(res.data);
        setLoading(false);

      })
      .catch(() => {

        toast.error('Failed to load issues');
        setLoading(false);

      });
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // CHECK OWNER
  const isOwner = (issue) => {

    if (!isAuthenticated) return false;

    if (role === 'ADMIN') return false;

    return (
      issue.userId === currentUserId ||
      issue.createdBy === currentUserId ||
      issue.createdByName === currentUsername
    );
  };

  // DELETE ISSUE
  const deleteIssue = async (issueId) => {

    const confirmDelete = window.confirm(
      'Delete this issue permanently?'
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/issues/${issueId}`);

      setIssues(
        issues.filter((issue) => issue.id !== issueId)
      );

      toast.success('Issue deleted');

    } catch {

      toast.error('Failed to delete issue');
    }
  };

  // START EDIT
  const startEdit = (issue) => {

    setEditingIssueId(issue.id);

    setEditForm({
      title: issue.title || '',
      description: issue.description || '',
      location: issue.location || '',
      category: issue.category || '',
    });
  };

  // SAVE EDIT
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

  // FILTER
 const myIssues = issues.filter(
  (issue) =>
    issue.userId === currentUserId ||
    issue.createdBy === currentUserId ||
    issue.createdByName === currentUsername
);

const filteredIssues =
  filterStatus === 'ALL'
    ? myIssues
    : myIssues.filter(
        (issue) => issue.status === filterStatus
      );

  // LOADING
  if (loading) {

    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '18px',
          color: '#6B7280',
        }}
      >
        Loading issues...
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

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >

        {/* HEADER */}

        <div style={{ marginBottom: '32px' }}>

          <h1
            style={{
              fontSize: '42px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '10px',
            }}
          >
            Community Issues
          </h1>

          <p
            style={{
              color: '#6B7280',
              fontSize: '16px',
            }}
          >
            Track problems reported around your neighborhood.
          </p>

        </div>

        {/* FILTERS */}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '36px',
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
                fontWeight: '600',
                background:
                  filterStatus === status
                    ? '#7C3AED'
                    : '#E5E7EB',
                color:
                  filterStatus === status
                    ? '#FFFFFF'
                    : '#374151',
                transition: '0.2s',
              }}
            >
              {status.replace('_', ' ')}
            </button>

          ))}

        </div>

        {/* EMPTY */}

        {filteredIssues.length === 0 && (

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '50px',
              textAlign: 'center',
              border: '1px solid #E5E7EB',
              color: '#6B7280',
              fontSize: '18px',
            }}
          >
            No issues found.
          </div>

        )}

        {/* GRID */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >

          {filteredIssues.map((issue) => {

            const statusConfig =
              STATUS_CONFIG[issue.status] ||
              STATUS_CONFIG.PENDING;

            const canModify = isOwner(issue);

            return (

              <div
                key={issue.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  boxShadow:
                    '0 4px 20px rgba(0,0,0,0.05)',
                  transition: '0.2s',
                }}
              >

                {/* IMAGE */}

                {issue.imageUrl ? (

                  <img
                    src={`http://localhost:8080${issue.imageUrl}`}
                    alt={issue.title}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                    }}
                  />

                ) : (

                  <div
                    style={{
                      height: '220px',
                      background: '#F3F4F6',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#9CA3AF',
                      fontSize: '15px',
                    }}
                  >
                    No Image Available
                  </div>

                )}

                {/* BODY */}

                <div style={{ padding: '22px' }}>

                  {/* EDIT MODE */}

                  {editingIssueId === issue.id ? (

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >

                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Title"
                        style={inputStyle}
                      />

                      <textarea
                        rows="4"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                        style={inputStyle}
                      />

                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="Location"
                        style={inputStyle}
                      />

                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category: e.target.value,
                          })
                        }
                        style={inputStyle}
                      >

                        <option value="">
                          Select Category
                        </option>

                        {Object.keys(CATEGORY_ICONS).map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          )
                        )}

                      </select>

                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                        }}
                      >

                        <button
                          onClick={() =>
                            saveEdit(issue.id)
                          }
                          style={{
                            ...buttonStyle,
                            background: '#22C55E',
                            color: 'white',
                          }}
                        >
                          Save
                        </button>

                        <button
                          onClick={() =>
                            setEditingIssueId(null)
                          }
                          style={{
                            ...buttonStyle,
                            background: '#E5E7EB',
                            color: '#111827',
                          }}
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    <>
                      {/* TOP */}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '14px',
                        }}
                      >

                        <div
                          style={{
                            color: '#6B7280',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {CATEGORY_ICONS[
                            issue.category
                          ] || '📌'}{' '}
                          {issue.category || 'GENERAL'}
                        </div>

                        <div
                          style={{
                            background:
                              statusConfig.bg,
                            color:
                              statusConfig.color,
                            padding: '6px 12px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '700',
                          }}
                        >
                          {statusConfig.label}
                        </div>

                      </div>

                      {/* TITLE */}

                      <h2
                        style={{
                          fontSize: '24px',
                          color: '#111827',
                          marginBottom: '10px',
                        }}
                      >
                        {issue.title}
                      </h2>

                      {/* DESCRIPTION */}

                      <p
                        style={{
                          color: '#4B5563',
                          lineHeight: '1.7',
                          marginBottom: '20px',
                        }}
                      >
                        {issue.description}
                      </p>

                      {/* OFFICER NOTE */}

                      {issue.officerNote && (

                        <div
                          style={{
                            background: '#EEF2FF',
                            padding: '14px',
                            borderRadius: '14px',
                            marginBottom: '16px',
                          }}
                        >

                          <div
                            style={{
                              fontWeight: '700',
                              marginBottom: '6px',
                              color: '#4338CA',
                            }}
                          >
                            Authority Note
                          </div>

                          <div
                            style={{
                              color: '#4B5563',
                            }}
                          >
                            {issue.officerNote}
                          </div>

                        </div>

                      )}

                      {/* FOOTER */}

                      <div
                        style={{
                          borderTop:
                            '1px solid #E5E7EB',
                          paddingTop: '14px',
                          marginTop: '10px',
                          color: '#6B7280',
                          fontSize: '14px',
                        }}
                      >

                        <div
                          style={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            marginBottom: '8px',
                          }}
                        >

                          <span>
                            📍 {issue.location}
                          </span>

                          <span>
                            {issue.createdAt
                              ? new Date(
                                  issue.createdAt
                                ).toLocaleDateString()
                              : 'Unknown'}
                          </span>

                        </div>

                        <div>
                          Reported by:{' '}
                          <strong>
                            {issue.createdByName ||
                              'Anonymous'}
                          </strong>
                        </div>

                      </div>

                      {/* ACTIONS */}

                      {canModify && (

                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            marginTop: '20px',
                          }}
                        >

                          <button
                            onClick={() =>
                              startEdit(issue)
                            }
                            style={{
                              ...buttonStyle,
                              background: '#DBEAFE',
                              color: '#1D4ED8',
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteIssue(issue.id)
                            }
                            style={{
                              ...buttonStyle,
                              background: '#FEE2E2',
                              color: '#B91C1C',
                            }}
                          >
                            Delete
                          </button>

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

    </div>
  );
};

// COMMON STYLES

const inputStyle = {
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #D1D5DB',
  outline: 'none',
  fontSize: '14px',
};

const buttonStyle = {
  flex: 1,
  padding: '12px',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
};

export default IssuesFeed;