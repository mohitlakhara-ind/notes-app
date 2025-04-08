import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt, FaStickyNote, FaHome, FaPlus } from "react-icons/fa";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const serverAPI = import.meta.env.VITE_SERVER_API; // Replace with actual API URL

    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${serverAPI}/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(data);
        } catch (err) {
            setError("Failed to load user data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-800 dark:text-gray-300">Loading...</p>;
    if (error) return <p className="text-center text-red-600 dark:text-red-400 mt-10">{error}</p>;
    if (!user) return null;

    const userimg =
        user?.profile_img?.startsWith("http")
            ? user.profile_img
            : user?.profile_img
            ? `${serverAPI}/uploads/${user.profile_img.replace(/\\/g, "/")}`
            : "/default-avatar.png";

    return (
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6 transition-colors">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-md text-center">
                <img
                    src={userimg}
                    alt="User Profile"
                    className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-500 dark:border-indigo-400 shadow-md"
                />
                <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100">
                    {user.name || "Unknown User"}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">@{user.username || "username"}</p>
                <p className="text-gray-800 dark:text-gray-400 mt-2 italic">{user.bio || "I am a NoteNow user!"}</p>

                <div className="mt-4 flex justify-center items-center space-x-6">
                    <div className="bg-indigo-500 dark:bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg">
                        <p className="text-lg font-bold">{user.notes?.length || 0}</p>
                        <p className="text-sm">Notes</p>
                    </div>
                </div>

                <button
                    className="mt-6 flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 w-full rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-transform transform hover:scale-105 shadow-md"
                    onClick={() => navigate("/settings")}
                >
                    <FaUserEdit /> Edit Profile
                </button>
                <button
                    className="mt-4 flex items-center justify-center gap-2 bg-red-600 dark:bg-red-500 text-white px-6 py-3 w-full rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition-transform transform hover:scale-105 shadow-md"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    <FaSignOutAlt /> LogOut
                </button>
                <button
                    className="mt-4 flex items-center justify-center gap-2 bg-gray-600 dark:bg-gray-500 text-white px-6 py-3 w-full rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-transform transform hover:scale-105 shadow-md"
                    onClick={() => navigate("/notes")}
                >
                    <FaStickyNote /> View Notes
                </button>
                <button
                    className="mt-4 flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 w-full rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-transform transform hover:scale-105 shadow-md"
                    onClick={() => navigate("/home")}
                >
                    <FaHome /> Home
                </button>
                <button
                    className="mt-4 flex items-center justify-center gap-2 bg-green-600 dark:bg-green-500 text-white px-6 py-3 w-full rounded-lg hover:bg-green-700 dark:hover:bg-green-400 transition-transform transform hover:scale-105 shadow-md"
                    onClick={() => navigate("/create-note")}
                >
                    <FaPlus /> Create Note
                </button>
            </div>
        </div>
    );
};

export default Profile;
