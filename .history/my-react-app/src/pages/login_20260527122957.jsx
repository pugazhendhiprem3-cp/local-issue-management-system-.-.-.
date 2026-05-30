import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = ({ setIsAuthenticated }) => {

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

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

            const response = await axios.post(
                'http://localhost:8080/api/auth/login',
                loginData
            );

            console.log(response.data);

            const {
                token,
                role,
                userId,
                username
            } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);

            if (setIsAuthenticated) {
                setIsAuthenticated(true);
            }

            toast.success('Login Successful');

            navigate('/');

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data ||
                'Invalid email or password'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-100 px-4">

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-8">

                {/* HEADER */}
                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg">
                        🔑
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-800 mt-5">
                        Welcome Back
                    </h2>

                    <p className="text-slate-500 mt-2 text-sm">
                        Login to access your UrbanVoice dashboard
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleLoginSubmit}
                    className="space-y-5"
                >

                    {/* EMAIL */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 transition"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full p-3 pr-20 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 transition"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600 hover:text-violet-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>

                        </div>

                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 disabled:opacity-60 text-white font-bold py-3 rounded-2xl shadow-lg transition duration-300"
                    >
                        {loading
                            ? 'Authenticating...'
                            : 'Secure Login'}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;