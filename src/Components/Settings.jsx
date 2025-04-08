import React, { useState, useEffect } from "react";
import axios from "axios";
import Animator from "./Animator";

const Settings = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        username: "",
        profile_img: "",
    });

    const [initialUser, setInitialUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const token = localStorage.getItem("token");
    const serverAPI = import.meta.env.VITE_SERVER_API;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${serverAPI}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser({
                    name: data.name || "",
                    email: data.email || "",
                    username: data.username || "",
                    profile_img: data.profile_img || "",
                });
                setInitialUser({
                    name: data.name || "",
                    username: data.username || "",
                    profile_img: data.profile_img || "",
                });
            } catch (err) {
                setError("Failed to load user data.");
            }
        };
        if (token) fetchUser();
    }, [serverAPI, token]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (user.profile_img.startsWith("blob:")) {
                URL.revokeObjectURL(user.profile_img);
            }
            setSelectedImage(file);
            setUser({ ...user, profile_img: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("username", user.username);
            if (selectedImage) {
                formData.append("profile_img", selectedImage);
            }

            await axios.put(`${serverAPI}/user/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess("Profile updated successfully!");
            setInitialUser({ name: user.name, username: user.username, profile_img: user.profile_img });
            setSelectedImage(null);
        } catch (err) {
            console.error(err.response || err);
            setError(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const userimg = user.profile_img.startsWith("http")
        ? user.profile_img  // If it's from DiceBear, use the direct URL
        : `${serverAPI}/uploads/${user.profile_img.replace(/\\/g, "/")}`;


    const isDisabled =
        loading ||
        (initialUser &&
            user.name === initialUser.name &&
            user.username === initialUser.username &&
            !selectedImage);

    return (
        <Animator>
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div className="flex flex-col items-center">
                            <label className="relative cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <img
                                    src={userimg || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full border-4 border-blue-500 hover:opacity-80 transition-opacity duration-300"
                                />
                                <span className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                                    Change
                                </span>
                            </label>
                        </div>

                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="p-2 border rounded w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
                        />

                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            placeholder="Email"
                            className="p-2 border rounded w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
                            disabled
                        />

                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="p-2 border rounded w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
                        />


                        <button
                            type="submit"
                            className={`w-full py-2 rounded-lg transition ${isDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            disabled={isDisabled}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </Animator>
    );
};

export default Settings;
