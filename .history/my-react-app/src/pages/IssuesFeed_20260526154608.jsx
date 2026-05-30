import React, { useEffect, useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const IssuesFeed = () => {

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🟢 EDIT STATE
    const [editingIssueId, setEditingIssueId] = useState(null);

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        location: '',
        category: ''
    });

    // 🟢 USER ROLE
    const role = localStorage.getItem("role");

    // 🟢 FETCH ISSUES
    const fetchIssues = () => {

        API.get('/issues')
            .then((response) => {

                setIssues(response.data);

                setLoading(false);

            })
            .catch((err) => {

                console.error(err);

                toast.err("Failed to load issues");

                setLoading(false);
            });
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    // 🟢 DELETE ISSUE
    const deleteIssue = async (issueId) => {

        try {

            await API.delete(`/issues/${issueId}`);

            setIssues(
                issues.filter(issue => issue.id !== issueId)
            );

            alert("Issue Deleted Successfully");

        } catch (error) {

            console.error(error);

            alert("Failed to delete issue");
        }
    };

    // 🟢 START EDIT
    const startEdit = (issue) => {

        setEditingIssueId(issue.id);

        setEditForm({
            title: issue.title || '',
            description: issue.description || '',
            location: issue.location || '',
            category: issue.category || ''
        });
    };

    // 🟢 HANDLE EDIT CHANGE
    const handleEditChange = (e) => {

        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    // 🟢 SAVE EDIT
    const saveEdit = async (issueId) => {

        try {

            await API.put(
                `/issues/${issueId}`,
                editForm
            );

            setEditingIssueId(null);

            fetchIssues();

            alert("Issue Updated Successfully");

        } catch (error) {

            console.error(error);

            alert("Failed to update issue");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p className="text-xl font-semibold animate-pulse">
                    Loading local issues...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">
                <p className="text-xl font-bold">{error}</p>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <header className="mb-8 border-b border-gray-800 pb-4">

                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        📢 Community Issues Feed
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Track and view problems reported around your local neighborhood.
                    </p>

                </header>

                {/* EMPTY */}
                {issues.length === 0 ? (

                    <div className="text-center p-12 bg-gray-800 rounded-xl border border-gray-700">

                        <p className="text-gray-400 text-lg">
                            No issues reported yet.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {issues.map((issue) => (

                            <div
                                key={issue.id}
                                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl flex flex-col"
                            >

                                {/* IMAGE */}
                                {issue.imageUrl ? (

                                    <img
                                        src={`http://localhost:8080${issue.imageUrl}`}
                                        alt={issue.title}
                                        className="w-full h-48 object-cover border-b border-gray-700"
                                    />

                                ) : (

                                    <div className="w-full h-48 bg-gray-750 flex items-center justify-center border-b border-gray-700 text-gray-500">
                                        📷 No image evidence attached
                                    </div>

                                )}

                                {/* BODY */}
                                <div className="p-5 flex-1 flex flex-col justify-between">

                                    {/* EDIT MODE */}
                                    {editingIssueId === issue.id ? (

                                        <div className="space-y-3">

                                            <input
                                                type="text"
                                                name="title"
                                                value={editForm.title}
                                                onChange={handleEditChange}
                                                placeholder="Issue Title"
                                                className="w-full p-2 rounded bg-gray-700"
                                            />

                                            <textarea
                                                name="description"
                                                value={editForm.description}
                                                onChange={handleEditChange}
                                                placeholder="Issue Description"
                                                className="w-full p-2 rounded bg-gray-700"
                                            />

                                            <input
                                                type="text"
                                                name="location"
                                                value={editForm.location}
                                                onChange={handleEditChange}
                                                placeholder="Location"
                                                className="w-full p-2 rounded bg-gray-700"
                                            />

                                            <select
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleEditChange}
                                            className="w-full p-2 rounded bg-gray-700 text-white"
                                            >

                                                <option value="">Select Category</option>

                                                <option value="ROAD">Road</option>

                                                <option value="WATER">Water Supply</option>

                                                <option value="ELECTRICAL">Electrical</option>

                                                <option value="GARBAGE">Garbage</option>

                                                <option value="DRAINAGE">Drainage</option>

                                                <option value="STREET_LIGHT">Street Light</option>

                                                <option value="SEWAGE">Sewage</option>


                                                <option value="PARK">Park</option>

                                                <option value="OTHER">Other</option>

                                            </select>

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() => saveEdit(issue.id)}
                                                    className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded"
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    onClick={() => setEditingIssueId(null)}
                                                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <>
                                            {/* CATEGORY + STATUS */}
                                            <div className="flex justify-between items-start mb-2">

                                                <span className="text-xs font-semibold bg-gray-700 text-blue-400 px-2.5 py-1 rounded-full uppercase">
                                                    {issue.category || "General"}
                                                </span>

                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                                    issue.status === 'RESOLVED'
                                                        ? 'bg-green-900/40 text-green-400 border-green-800'
                                                        : issue.status === 'IN_PROGRESS'
                                                        ? 'bg-yellow-900/40 text-yellow-400 border-yellow-800'
                                                        : 'bg-orange-900/40 text-orange-400 border-orange-800'
                                                }`}>
                                                    {issue.status || "PENDING"}
                                                </span>

                                            </div>

                                            {/* TITLE */}
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {issue.title}
                                            </h3>

                                            {/* DESCRIPTION */}
                                            <p className="text-gray-400 text-sm mb-4">
                                                {issue.description}
                                            </p>

                                            {/* FOOTER */}
                                            <div className="border-t border-gray-700 pt-3 mt-2 text-xs text-gray-400 space-y-1">

                                                <div className="flex justify-between">

                                                    <span>
                                                        📍 {issue.location}
                                                    </span>

                                                    <span>
                                                        📅 {
                                                            issue.createdAt
                                                            ? new Date(issue.createdAt).toLocaleString()
                                                            : "Just now"
                                                        }
                                                    </span>

                                                </div>

                                                <div className="text-gray-500 pt-1">

                                                    Reported by:
                                                    <span className="text-gray-300 font-medium">
                                                        {" "}
                                                        {issue.createdByName || "Anonymous User"}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* ACTION BUTTONS */}
                                            <div className="flex gap-3 mt-4">

                                                <button
                                                    onClick={() => startEdit(issue)}
                                                    className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-sm"
                                                >
                                                    ✏ Edit
                                                </button>

                                                <button
                                                    onClick={() => deleteIssue(issue.id)}
                                                    className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm"
                                                >
                                                    🗑 Delete
                                                </button>

                                            </div>

                                        </>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default IssuesFeed;