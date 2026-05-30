import React, { useState } from 'react';
import axios from 'axios';

const CreateIssue = () => {
  // 1. Create state hooks to keep track of the form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null); // Keeps track of the physical binary file
  
  // State for tracking submission status
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 2. Handle file selection changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Save the selected file object into our state
    }
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser page from reloading automatically
    setLoading(true);
    setMessage('');

    // CRUCIAL: Use FormData because we are transmitting a physical file attachment
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('category', category);
    
    if (imageFile) {
      // "file" must exactly match the parameter name expected by your Backend Controller 
      // (e.g., @RequestParam("file") MultipartFile file)
      formData.append('file', imageFile); 
    }

    try {
      // Retrieve your JWT token from LocalStorage (or wherever your application saves it upon Login)
      const token = localStorage.getItem('token'); 

      if (!token) {
        throw new Error("No authentication token found. Please log in first.");
      }

      // Send the request to your Spring Boot Backend endpoint
      const response = await axios.post('http://localhost:8080/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Instructs axios to format this request correctly
          'Authorization': `Bearer ${token}`    // Fixes the 403 Forbidden roadblock!
        }
      });

      setMessage('🎉 Issue reported successfully!');
      
      // Clear out the form inputs on a successful save
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('');
      setImageFile(null);
      
    } catch (error) {
      console.error("Submission Error Details:", error);
      setMessage(error.response?.data?.message || '❌ Failed to report issue. Verify you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">🚨 Report a Local Issue</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded text-sm font-semibold ${message.startsWith('🎉') ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/40 text-rose-300'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Issue Title</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Broken street light, Water leakage"
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        {/* Category Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Category</label>
          <input 
            type="text" 
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Roads, Utilities, Sanitation"
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Location / Area</label>
          <input 
            type="text" 
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Chennai, Street Name, Ward No"
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Detailed Description</label>
          <textarea 
            rows="4"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide explicit details about the local issue..."
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        {/* File Image Upload Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Upload Evidence Photo</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Submitting Report...' : 'Submit Issue Report'}
        </button>
      </form>
    </div>
  );
};

export default CreateIssue;