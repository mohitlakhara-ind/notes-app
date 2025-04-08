import React, { useState, useRef, useEffect } from "react";
import InputComp from "./InputComp.jsx";
import { FaRegUser, FaEnvelope, FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from 'axios';

function Auth({ type }) {
    const serverAPI = import.meta.env.VITE_SERVER_API;
    const navigate = useNavigate();
    
    const AuthForm = useRef();
    const handleSubmit = (e) => {
        e.preventDefault();
        let form = new FormData(AuthForm.current);
        let formData = Object.fromEntries(form.entries());

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (isSignUp) {
            if (!formData.name || !formData.email || !formData.password) { //|| !formData.confirmPassword
                return toast.error("All fields are required for sign up.");
            }
            // if (formData.password !== formData.confirmPassword) {
            //     return toast.error("Passwords do not match.");
            // }
        }

        if (!formData.email || !formData.password) {
            return toast.error("Email and password are required.");
        }

        if (!emailRegex.test(formData.email)) {
            return toast.error("Invalid email format.");
        }

        if (!passwordRegex.test(formData.password)) {
            return toast.error("Password must be 8+ characters with at least one letter & number.");
        }

        let serverRoute = type === "signin" ? "/signin" : "/signup";
        userAuth(serverRoute, formData);
    };


    const userAuth = async (sRoute, formData) => {
        try {
            const response = await axios.post(serverAPI + "/user" + sRoute, formData);
            if (!response.data) throw new Error("Empty response received!");

            const { token, user, error } = response.data;

            if (response.status === 200) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                toast.success(sRoute === "/signin" ? "Login successful!" : "Signup successful!");
                AuthForm.current.reset();
                navigate("/");
            } else {
                throw new Error(error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            toast.error(error.response?.data?.error || "Signup failed. Please try again.");
        }
    };


    const isSignUp = type === "signup";

    return (
        <div className="h-screen flex items-center justify-center">
            <Toaster />
            <div className="bg-[] form-container w-100 justify-center dark:bg-[#1e1e2f] my-auto shadow-lg m-auto p-6 bg-white rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h1>
                <form id="auth-form" ref={AuthForm} className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {isSignUp && (
                        <InputComp
                            type="text"
                            placeholder="Enter Your Name"
                            name="name"
                            icon={<FaRegUser />}
                        />
                    )}
                    <InputComp
                        type="email"
                        placeholder="Enter Your Email"
                        name="email"
                        icon={<FaEnvelope />}
                    />
                    <InputComp
                        type="password"
                        placeholder="Enter Your Password"
                        name="password"
                        icon={<FaLock />}
                    />
                    {/* {isSignUp && (
                        <InputComp
                            type="password"
                            placeholder="Confirm Your Password"
                            name="confirmPassword"
                            icon={<FaLock />}
                        />
                    )} */}
                    <button
                        type="submit"
                        className="bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-400 hover:text-black hover:border transition duration-200"
                        aria-label={isSignUp ? "Sign Up" : "Sign In"}
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </form>
                <div className="border-t border-gray-900 my-2 mx-2">
                    {type === "signin" ? (
                        <div className="text-center text-sm text-gray-600">
                            <span>Don't have an account? </span>
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-blue-500 hover:underline"
                            >
                                Sign up here
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-sm text-gray-600">
                            <span>Already have an account? </span>
                            <button
                                onClick={() => navigate("/signin")}
                                className="text-blue-500 hover:underline"
                            >
                                Sign in here
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Auth;