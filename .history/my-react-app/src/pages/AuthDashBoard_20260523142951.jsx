import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AdminDashboard = () => {

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🟢 Fetch all issues
    const fetchIssues = async () => {

        try {

            const response = await API.get('/issues');

            setIssues(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    // 🟢 Update Issue Status
    const updateStatus = async (issueId, newStatus) => {

        try {

            const formData = new FormData();

            formData.append('status', newStatus);

            await API.patch(
                `/issues/${issueId}/status`,
                formData
            );

            // Refresh issues after update
            fetchIssues();

        } catch (error) {

            console.error(error);

            alert('Failed to update issue status');
        }
    };

    if (loading) {
        return (
            <div className="text-white text-center mt-10">
                Loading Admin Dashboard...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-900 text-white p-6">

            <h1 className="text-3xl font-bold text-emerald-400 mb-8">
                🛠 Admin Dashboard
            </h1>

            <div className="space-y-6">

                {issues.map((issue) => (

                    <div
                        key={issue.id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-5"
                    >

                        {/* IMAGE */}
                        {issue.imageUrl && (
                            <img
                                src={`http://localhost:8080${issue.imageUrl}`}
                                alt={issue.title}
                                className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                        )}

                        {/* ISSUE INFO */}
                        <h2 className="text-2xl font-bold text-white">
                            {issue.title}
                        </h2>

                        <p className="text-slate-400 mt-2">
                            {issue.description}
                        </p>

                        <div className="mt-4 space-y-1 text-sm text-slate-300">

                            <p>📍 {issue.location}</p>

                            <p>📂 {issue.category}</p>

                            <p>
                                📅 {
                                    issue.createdAt
                                    ? new Date(issue.createdAt).toLocaleString()
                                    : 'Unknown'
                                }
                            </p>

                            <p>
                                👤 {issue.createdByName || 'Anonymous'}
                            </p>

                            <p>
                                🚦 Current Status:
                                <span className="ml-2 font-bold text-emerald-400">
                                    {issue.status}
                                </span>
                            </p>

                        </div>

                        {/* STATUS BUTTONS */}
                        <div className="flex gap-3 mt-5 flex-wrap">

                            <button
                                onClick={() => updateStatus(issue.id, 'PENDING')}
                                className="bg-orange-700 hover:bg-orange-600 px-4 py-2 rounded-lg"
                            >
                                Pending
                            </button>

                            <button
                                onClick={() => updateStatus(issue.id, 'IN_PROGRESS')}
                                className="bg-yellow-700 hover:bg-yellow-600 px-4 py-2 rounded-lg"
                            >
                                In Progress
                            </button>

                            <button
                                onClick={() => updateStatus(issue.id, 'RESOLVED')}
                                className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg"
                            >
                                Resolved
                            </button>

                            <button
                                onClick={() => updateStatus(issue.id, 'REJECTED')}
                                className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg"
                            >
                                Rejected
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default AdminDashboard;