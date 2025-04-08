import React, { useState, useRef, useMemo } from "react";
import InputComp from "../Components/InputComp";
import { MdSubtitles } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Animator from "../Components/Animator";
import { FaImage } from "react-icons/fa";

export default function CreateNote() {
    const [note, setNote] = useState({ title: "", tags: "" });
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const token = localStorage.getItem("token");
    const serverAPI = import.meta.env.VITE_SERVER_API;
    const navigate = useNavigate();
    const editor = useRef(null);


    const config = useMemo(() => ({
        readonly: false,
        toolbarButtonSize: "middle",
        placeholder: "Write your note here...",
        buttons: [
            "bold", "italic", "underline", "font", "fontsize",
            "paragraph", "image", "video", "align",
            "undo", "redo", "hr", "table", "link", "unlink",
            "cut", "copy", "paste", "print", "fullsize","h1"
        ],
        toolbarAdaptive: true,
        toolbarSticky: false,
    }), []);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!note.title.trim() || !content.trim()) {
            setError("Title and content cannot be empty!");
            toast.error("Title and content cannot be empty!");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", note.title);
            formData.append("content", content);
            formData.append("tags", note.tags);
            if (selectedImage) formData.append("image", selectedImage);

            const response = await axios.post(`${serverAPI}/notes/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                setSuccess("Note created successfully!");
                toast.success("Note created successfully!");
                navigate("/all-notes");
            }
        } catch (err) {
            console.error("Error creating note:", err);
            setError(err.response?.data?.message || "Failed to create note.");
            toast.error(err.response?.data?.message || "Failed to create note.");
        } finally {
            setLoading(false);
        }
    };
    const resetImage = () => {
        setSelectedImage(null);
    };

    return (
        <Animator>
            <div className="md:min-h-screen  flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-amber-100 md:p-6 sm:w-full">
                <Toaster />
                <div className="form-container w-full max-w-4xl shadow-xl p-5 bg-white dark:bg-gray-800 dark:text-amber-100 rounded-lg transition-all">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
                        Create New Note
                    </h1>

                    {error && <p className="text-red-600 dark:text-red-400 text-center">{error}</p>}
                    {success && <p className="text-green-600 dark:text-green-400 text-center">{success}</p>}

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {/* Title */}
                        <InputComp
                            type="text"
                            placeholder="Enter Note Title"
                            name="title"
                            icon={<MdSubtitles />}
                            value={note.title}
                            onChange={(e) => setNote({ ...note, title: e.target.value })}
                        />

                        {/* Thumbnail Upload */}
                        <div
                            onClick={() => document.getElementById("thumbnailUpload").click()}
                            className="h-50 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-300 text-lg text-center rounded-lg p-6 mb-4 cursor-pointer transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="thumbnailUpload"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {selectedImage ? (
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Thumbnail Preview"
                                    className="w-40 h-40 object-cover mt-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-md cursor-pointer"
                                    onClick={resetImage} // Click to remove image
                                    onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Prevent memory leak
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FaImage className="text-4xl mb-2" />
                                    <span>Add Thumbnail Image</span>
                                </div>
                            )}
                        </div>

                        {/* Content Editor */}
                        <JoditEditor
                            ref={(instance) => (editor.current = instance)}
                            value={content}
                            config={config}
                            tabIndex={1}
                            onChange={(newContent) => setContent(newContent)}
                            className="border  border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 dark:text-black transition-all"
                        />

                        {/* Tags */}
                        <InputComp
                            type="text"
                            placeholder="Enter tags separated with commas (,)"
                            name="tags"
                            icon={<FaTags />}
                            value={note.tags}
                            onChange={(e) => setNote({ ...note, tags: e.target.value })}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`py-2 rounded-lg transition-all duration-200 font-medium 
                    ${loading
                                    ? "opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400 text-white hover:scale-105 hover:shadow-lg"}`}
                        >
                            {loading ? "Creating..." : "Create Note"}
                        </button>
                    </form>
                </div>
            </div>

        </Animator>
    );
}
