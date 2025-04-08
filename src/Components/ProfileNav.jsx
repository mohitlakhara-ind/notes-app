import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiLoginCircleLine } from "react-icons/ri";
import { PiUserCirclePlusFill } from "react-icons/pi";
import Navlink from "./Navlink";
import Animator from "./Animator";

export default function ProfileNav() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const serverAPI = import.meta.env.VITE_SERVER_API;

    const handleUserDropdown = () => setDropdownOpen((prev) => !prev);

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
        if (token) fetchUser();
    }, [token]);

    if (loading) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Loading...</p>;
    if (error) return <p className="text-center text-red-500 dark:text-red-400 mt-10">{error}</p>;
    if (!user && token) return null; // Ensures UI doesn't break if user data is missing

    const userimg =
        user?.profile_img?.startsWith("http")
            ? user.profile_img
            : user?.profile_img
                ? `${serverAPI}/uploads/${user.profile_img.replace(/\\/g, "/")}`
                : "/default-avatar.png";

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
    };

    return (
        <>

            <Animator>
                {token ? (
                    <div className="relative">
                        {/* User Profile Button */}
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 p-2 text-xl text-gray-800 rounded-md hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                            onClick={handleUserDropdown}
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            <img
                                className="border-3 h-10 w-10 bg-gray-500  rounded-full"
                                src={userimg}
                                alt="User Avatar"
                            />
                            {user?.name || "User"}
                            <svg
                                className="size-3.5 ml-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m7 15 5 5 5-5" />
                                <path d="m7 9 5-5 5 5" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute left-0 pb-3 mt-2 w-48 bg-white shadow-md rounded-md dark:bg-gray-800">
                                <ul className="py-2 list-none">
                                    <Navlink location="/profile" name="My Account" icon={<RiLoginCircleLine />} />
                                    <Navlink location="/settings" name="Settings" icon={<RiLoginCircleLine />} />
                                </ul>
                                <button
                                    className="w-full flex items-center gap-2 px-2 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    onClick={handleSignOut}
                                >
                                    <RiLoginCircleLine />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ul>
                        <li>
                            <Link to="/signin" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <RiLoginCircleLine />
                                <span className="ms-3">Log In</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <PiUserCirclePlusFill />
                                <span className="ms-3">Sign Up</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </Animator>
        </>
    );
}
