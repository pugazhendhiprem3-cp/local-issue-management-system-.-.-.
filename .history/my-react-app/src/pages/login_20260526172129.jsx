import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 🟢 Destructure setIsAuthenticated passed down from App.jsx
const Login = ({ setIsAuthenticated }) => {

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    // 🟢 State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // 🟢 Dynamically track typing inside inputs
    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            // 🟢 Send credentials to Spring Boot backend
            const response = await axios.post(
                'http://localhost:8080/api/auth/login',
                loginData
            );
            console.log(response.data);

            // 🟢 Extract token and role
            const { token, role, userId, username } = response.data;

            // 🟢 Store auth data in browser
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem("userId",userId);
            localStorage.setItem("username",username);

            // 🟢 Update authentication state
            if (setIsAuthenticated) {
                setIsAuthenticated(true);
            }

            toast.success('Login successful');

            // 🟢 Redirect to home page
            navigate('/');

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data ||
                'Invalid email or password. Please try again.'
            );

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

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-emerald-400">
                        🔑 Sign In
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                        Access your citizen or admin account dashboard
                    </p>
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Email Address
                    </label>

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

                {/* Password Input */}
                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                        Password
                    </label>

                    <div className="relative">

                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            //placeholder="Enter Password"
                            className="w-full p-3 pr-16 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-100 transition-colors"
                        />

                        {/* Show / Hide Button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-emerald-300 z-10"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>

                    </div>

                </div>

                {/* Submit Button */}
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