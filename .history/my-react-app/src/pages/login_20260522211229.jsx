import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Sending login payload for auth verification...");
            
            // 1. POST request to matching backend endpoint path
            const response = await api.post('/api/auth/login', { email, password });
            
            console.log("Full Backend Response Data Received:", response.data);

            // 2. Extract token safely matching LoginResponseDTO fields
            if (response.data && response.data.token) {
                const token = response.data.token;
                
                // 3. Commit secure key token to storage string cache
                localStorage.setItem('token', token);
                
                alert("🎉 Login successful! Welcome back.");
                navigate('/'); // Forward user directly to dashboard layout page
            } else {
                console.error("Token field missing inside backend response payload structure.");
                alert("Login failed: Invalid server response.");
            }

        } catch (error) {
            console.error("Detailed Axios Failure Log:", error);
            
            if (error.response) {
                // The server responded with a status code out of the 2xx range
                console.error("Backend Error Status:", error.response.status);
                console.error("Backend Error Message:", error.response.data);
                alert(`Login Failed: ${error.response.data.message || "Invalid Email or Password"}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received from server. Is Spring Boot running?");
                alert("Login Failed: Network Error, cannot reach backend server.");
            } else {
                alert("Login Failed: Something went wrong checking your credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-center text-sm mb-8">Sign in to report and track neighborhood civic issues</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white outline-none transition"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-semibold py-3 rounded-xl transition shadow-lg mt-2"
                    >
                        {loading ? "Checking details..." : "Sign In Securely"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-emerald-400 hover:underline font-medium">Create one here</Link>
                </div>
            </div>
        </div>
    );
};

// Make sure it matches your router distribution layout target
export default Login;