import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../services/api';
const IssuesFeed = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch issues from your running Spring Boot backend API
        API.get('/issues')
            .then((response) => {
                setIssues(response.data);
                setLoading(false);
    })
            .catch((err) => {
                console.error("Error fetching data from backend: ", err);
                setError("Failed to load issues feed. Make sure backend is running!");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p className="text-xl font-semibold animate-pulse">Loading local issues...</p>
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
                <header className="mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        📢 Community Issues Feed
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Track and view problems reported around your local neighborhood.
                    </p>
                </header>

                {issues.length === 0 ? (
                    <div className="text-center p-12 bg-gray-800 rounded-xl border border-gray-700">
                        <p className="text-gray-400 text-lg">No issues reported yet. Be the first to report one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {issues.map((issue) => (
                            <div 
                                key={issue.id} 
                                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl hover:border-blue-500 transition-all duration-200 flex flex-col"
                            >
                                {/* 🖼️ Display Uploaded Image Evidence */}
                                {issue.imageUrl ? (
                                    <img 
                                        src={`http://localhost:8080${issue.imageUrl}`} 
                                        alt={issue.title}
                                        className="w-full h-48 object-cover border-b border-gray-700"
                                        onError={(e) => {
                                            // Handle fallback placeholder if target graphic is missing
                                            e.target.src = "https://placehold.co/600x400/1f2937/9ca3af?text=No+Image+Available";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-750 flex items-center justify-center border-b border-gray-700 text-gray-500">
                                        📷 No image evidence attached
                                    </div>
                                )}

                                {/* Card Body Text Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold bg-gray-700 text-blue-400 px-2.5 py-1 rounded-full uppercase">
                                                {issue.category || "General"}
                                            </span>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                                issue.status === 'RESOLVED' ? 'bg-green-900/40 text-green-400 border-green-800' :
                                                issue.status === 'IN_PROGRESS' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-800' :
                                                'bg-orange-900/40 text-orange-400 border-orange-800'
                                            }`}>
                                                {issue.status || "PENDING"}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                            {issue.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {issue.description}
                                        </p>
                                    </div>

                                    {/* Footer Info details */}
                                    <div className="border-t border-gray-700 pt-3 mt-2 text-xs text-gray-400 space-y-1">
                                        <div className="flex justify-between">
                                            <span>📍 {issue.location}</span>
                                            <span>📅 {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "Just now"}</span>
                                        </div>
                                        {/* 🟢 SAFE CHECK FOR USER: Using createdByName directly with a default string fallback to block crash screens! */}
                                        <div className="text-gray-500 pt-1">
                                            Reported by: <span className="text-gray-300 font-medium">{issue.createdByName || "Anonymous User"}</span>
                                        </div>
                                    </div>
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