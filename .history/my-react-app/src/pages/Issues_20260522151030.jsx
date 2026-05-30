import { useEffect, useState } from "react";
import api from "../services/api";

export default function Issues() {

    const [issues, setIssues] = useState([]);

    useEffect(() => {

        fetchIssues();

    }, []);

    const fetchIssues = async () => {

        try {

            const response =
                await api.get("/issues");

            setIssues(response.data);

            console.log(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to fetch issues");
        }
    };

    return (

        <div className="min-h-screen bg-[#0f172a] p-10">

            <h1 className="text-4xl font-bold text-white mb-10 text-center">
                Local Issues Feed
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {issues.map((issue) => (
                    
                    <div
                        key={issue.id}
                        className="bg-[#1e293b] rounded-3xl overflow-hidden shadow-lg border border-gray-700 hover:scale-[1.02] transition duration-300"
                    >
                        <p className="text-red-500">
                            {issue.imageUrl}
                        </p>
                        <img
    src={`http://localhost:8080${issue.imageUrl}`}
    alt="Issue"
    className="w-full h-52 object-cover rounded-t-2xl"
/>

                        <div className="p-6">

                            <div className="flex justify-between items-center mb-4">

                                <h2 className="text-2xl font-bold text-white">
                                    {issue.title}
                                </h2>

                                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                                    {issue.status}
                                </span>

                            </div>

                            <p className="text-gray-300 mb-4">
                                {issue.description}
                            </p>

                            <div className="space-y-2">

                                <p className="text-gray-400">
                                    📍 {issue.location}
                                </p>

                                <p className="text-blue-400">
                                    {issue.category}
                                </p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}