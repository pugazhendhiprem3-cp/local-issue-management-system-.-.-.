import { useState } from "react";
import api from "../services/api";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

           const response = await api.post("/auth/login", { email, password });

            localStorage.setItem(
                "token",
                response.data.token
            );

            alert("Login Successful");

        } catch (error) {

            console.log(error);

            alert("Login Failed");
        }
    };

    return (

        <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">

            {/* BACKGROUND GLOW */}
            <div className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full blur-[180px] opacity-30 top-[-100px] left-[-100px]" />

            <div className="absolute w-[400px] h-[400px] bg-purple-500 rounded-full blur-[180px] opacity-20 bottom-[-100px] right-[-100px]" />

            {/* MAIN CARD */}
            <div className="relative z-10 w-full max-w-md p-1 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_50px_rgba(59,130,246,0.5)]">

                <div className="bg-[#0f172a] rounded-3xl p-10">

                    {/* LOGO */}
                    <div className="flex justify-center mb-6">

                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            LI
                        </div>

                    </div>

                    {/* TITLE */}
                    <div className="text-center mb-8">

                        <h1 className="text-4xl font-extrabold text-white tracking-wide">
                            Local Issue
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Smart City Reporting Platform
                        </p>

                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleLogin}
                        className="space-y-6"
                    >

                        {/* EMAIL */}
                        <div>

                            <label className="text-gray-300 text-sm block mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="john@gmail.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full bg-[#1e293b] border border-gray-700 focus:border-blue-500 text-white rounded-2xl px-5 py-4 outline-none transition duration-300"
                            />

                        </div>

                        {/* PASSWORD */}
                        <div>

                            <label className="text-gray-300 text-sm block mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full bg-[#1e293b] border border-gray-700 focus:border-purple-500 text-white rounded-2xl px-5 py-4 outline-none transition duration-300"
                            />

                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition duration-300 shadow-lg"
                        >
                            Login
                        </button>

                    </form>

                    {/* FOOTER */}
                    <div className="mt-8 text-center">

                        <p className="text-gray-500 text-sm">
                            Powered by React + Spring Boot + JWT
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}