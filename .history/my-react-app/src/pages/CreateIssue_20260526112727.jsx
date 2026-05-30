import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Toaster, toast } from "sonner";
const CreateIssue = () => {

    // 🟢 Full Form State
    const [formDataState, setFormDataState] = useState({
        title: '',
        description: '',
        location: '',
        category: '',
    });

    const [imageFile, setImageFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // 🟢 Handle Input Changes
    const handleChange = (e) => {
        setFormDataState({
            ...formDataState,
            [e.target.name]: e.target.value
        });
    };

    // 🟢 Handle Image Upload
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // 🟢 Submit Form
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError('');

        try {

            // 🟢 MULTIPART FORM DATA
            const formData = new FormData();

            formData.append('title', formDataState.title);
            formData.append('description', formDataState.description);
            formData.append('location', formDataState.location);
            formData.append('category', formDataState.category);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            // 🟢 API REQUEST
            await API.post('/issues', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('🎉 Issue Report Submitted Successfully!');

            navigate('/');

        } catch (err) {

            console.error(err);

            setError(
               toast.error("Failed to submit issue");
            );

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

                {/* HEADER */}
                <div>

                    <h2 className="text-2xl font-bold text-emerald-400">
                        ➕ Report an Issue
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                        Help improve your neighborhood by reporting civic problems.
                    </p>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm p-3 rounded-xl text-center">
                        ⚠️ {error}
                    </div>
                )}

                {/* TITLE */}
                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Issue Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formDataState.title}
                        onChange={handleChange}
                        placeholder="e.g. Suspicious activities, Transformer issues, Garbage not collected,"
                        required
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100"
                    />

                </div>

                {/* DESCRIPTION */}
                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Detailed Description
                    </label>

                    <textarea
                        name="description"
                        value={formDataState.description}
                        onChange={handleChange}
                        placeholder="Explain the issue clearly..."
                        required
                        rows="4"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100 resize-none"
                    />

                </div>

                {/* LOCATION */}
                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Location
                    </label>

                    <input
                        type="text"
                        name="location"
                        value={formDataState.location}
                        onChange={handleChange}
                        placeholder="e.g. Gandhi Street, Chennai"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100"
                    />

                </div>

                {/* CATEGORY */}
                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Category
                    </label>

                    <select
                        name="category"
                        value={formDataState.category}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100"
                    >
                        <option value="">Select Category</option>
                        <option value="ROAD">Road</option>
                        <option value="WATER">Water</option>
                        <option value="ELECTRICAL">Electrical</option>
                        <option value="GARBAGE">Garbage</option>
                        <option value="DRAINAGE">Drainage</option>
                        <option value="STREETLIGHT">Street Light</option>
                        <option value="OTHERS">Others</option>
                    </select>

                </div>

                {/* IMAGE */}
                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Attach Proof Image
                    </label>

                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 border-dashed">

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900 cursor-pointer"
                        />

                    </div>

                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold p-3 rounded-xl transition duration-200"
                >
                    {loading ? 'Submitting...' : 'Submit Issue Report'}
                </button>

            </form>

        </div>
    );
};

export default CreateIssue;