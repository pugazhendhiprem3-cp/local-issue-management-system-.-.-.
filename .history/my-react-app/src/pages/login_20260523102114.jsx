import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 🟢 Destructure setIsAuthenticated passed down from App.jsx
const Login = ({ setIsAuthenticated }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // Dynamically track typing inside inputs
    const handleChange = (e) => {
        setLoginData({ 
            ...loginData, 
            [e.target.name]: e.target.value 
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 🟢 Send credentials to your Spring Boot API endpoint
            const response = await axios.post('http://localhost:8080/api/user/login', loginData);
            
            // Extract the token and user role returned by your DTO
            const { token, role } = response.data;

            // 🟢 Persist authentication data in the browser
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // 🟢 Instantly flip the state in App.jsx to change navbar button
            if (setIsAuthenticated) {
                setIsAuthenticated(true);
            }

            alert('Welcome Back! Login Successful.');
            
            // Redirect to the home issues feed page
            navigate('/'); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <form 
                onSubmit={handleLoginSubmit} 
                className="bg-slate-950 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-emerald-400">🔑 Sign In</h2>
                    <p className="text-slate-400 text-sm mt-1">Access your citizen or admin account dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm p-3 rounded-xl text-center">
                        ⚠️ {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={loginData.email}
                        onChange={handleChange} 
                        required 
                        placeholder="name@example.com"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100 transition-colors" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={loginData.password}
                        onChange={handleChange} 
                        required 
                        placeholder="••••••••"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100 transition-colors" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold p-3 rounded-xl transition duration-200 shadow-md shadow-emerald-900/20"
                >
                    {loading ? 'Authenticating...' : 'Secure Log In'}
                </button>
            </form>
        </div>
    );
};

export default Login;