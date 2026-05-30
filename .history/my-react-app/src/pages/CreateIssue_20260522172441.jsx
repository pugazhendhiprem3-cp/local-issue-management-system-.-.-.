import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Uses your centralized api configuration

const CreateIssue = () => {
    const navigate = useNavigate();
    
    // 1. Component States for the form inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('ROADS'); // Default option
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // 2. Capture selected binary image evidence
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // 3. Handle Form Submission to Backend Filter API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // FormData is REQUIRED to upload files alongside text content!
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('location', location);
            
            if (imageFile) {
                formData.append('image', imageFile); // 'image' matches your backend parameter name!
            }

            // POST to your authenticated /issues endpoint
            const response = await api.post('/issues', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Read safety fallback values from the response payload DTO
            const creator = response.data.createdByName || "Anonymous";
            alert(`🎉 Success! Issue reported successfully by ${creator}.`);
            
            // Redirect back to Home page feed to see the newly generated card
            navigate('/');

        } catch (error) {
            console.error("Error submitting issue details to backend: ", error);
            alert("Failed to report issue. Ensure you are signed in or that your server is running.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl mt-6">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                ➕ Report a New Civic Issue
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* TITLE */}
                <div>
                    <label className="block text-slate-300 text-sm mb-1.5 font-medium">Issue Title</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g., Massive pothole near Main St intersection"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition"
                    />
                </div>

                {/* CATEGORY & LOCATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-300 text-sm mb-1.5 font-medium">Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition"
                        >
                            <option value="ROADS">Roads & Potholes</option>
                            <option value="WATER">Water Supply & Leakage</option>
                            <option value="ELECTRICITY">Power Outage / Streetlights</option>
                            <option value="WASTE">Garbage & Waste Disposal</option>
                            <option value="OTHER">Other Issues</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-1.5 font-medium">Neighborhood / Location</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g., Sector 4, Block B"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition"
                        />
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="block text-slate-300 text-sm mb-1.5 font-medium">Detailed Description</label>
                    <textarea 
                        rows="4"
                        required
                        placeholder="Describe the problem clearly so local municipal teams can investigate..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition resize-none"
                    />
                </div>

                {/* IMAGE UPLOAD FILE INPUT */}
                <div>
                    <label className="block text-slate-300 text-sm mb-1.5 font-medium">Upload Image Evidence (Optional)</label>
                    <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-4 transition bg-slate-900/50 flex flex-col items-center justify-center text-center cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <span className="text-sm text-slate-400">
                            {imageFile ? `📸 Selected: ${imageFile.name}` : "📁 Click here to select an image from file system"}
                        </span>
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl tracking-wide shadow-lg transition duration-200"
                    >
                        {submitting ? "Uploading Report Content..." : "🚀 File Official Report"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateIssue;
