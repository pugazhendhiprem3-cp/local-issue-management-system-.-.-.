import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🟢 Correct relative import from src/pages/ to src/services/
import API from '../services/api'; 

const CreateIssue = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Use FormData to send both text fields and binary file uploads via Multipart request
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile); 
        }

        try {
            // Send request to your Spring Boot issue endpoint (e.g., POST http://localhost:8080/issues)
            await API.post('/issues', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('🎉 Issue reported successfully!');
            navigate('/'); // Redirect user back to home live board
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit issue. Please verify you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form 
                onSubmit={handleSubmit} 
                className="bg-slate-950 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-5"
            >
                <div>
                    <h2 className="text-2xl font-bold text-emerald-400">➕ Report an Issue</h2>
                    <p className="text-slate-400 text-sm mt-1">Help improve your neighborhood by bringing attention to a local issue.</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm p-3 rounded-xl text-center">
                        ⚠️ {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Issue Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Large pothole on Main Street, Broken street light"
                        required
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Detailed Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about the issue location, severity, or any details that help authorities fix it..."
                        required
                        rows="4"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100 transition-colors resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Attach Proof Image</label>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center border-dashed hover:border-emerald-500/50 transition-colors cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900 cursor-pointer"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold p-3 rounded-xl transition duration-200 shadow-md shadow-emerald-900/20"
                >
                    {loading ? 'Submitting Report...' : 'Submit Issue Report'}
                </button>
            </form>
        </div>
    );
};

export default CreateIssue;