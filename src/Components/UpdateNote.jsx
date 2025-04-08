import InputComp from '../Components/InputComp';
import { MdSubtitles } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';
import { FaTags } from 'react-icons/fa';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Placeholder from '../assets/noimg.jpg';

export default function UpdateNote({ isOpen, onClose, noteId, initialData }) {
    const UNForm = useRef();
    const editor = useRef(null);
    const [content, setContent] = useState(initialData?.content || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [tags, setTags] = useState(initialData?.tags || '');
    const [selectedImage, setSelectedImage] = useState(null);

    const serverAPI = import.meta.env.VITE_SERVER_API || "http://localhost:5000";
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content || '');
            setTitle(initialData.title || '');
            setTags(initialData.tags || '');
        }
    }, [initialData]);

    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
            }
        };
    }, [selectedImage]);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start typing...',
        uploader: {
            insertImageAsBase64URI: true,
        },
        toolbarAdaptive: true,
        toolbarSticky: true,
    }), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('tags', tags);
            if (selectedImage) formData.append('image', selectedImage);

            await axios.put(`${serverAPI}/notes/update/${noteId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Note updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error('Failed to update note');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImage(file);
        }
    };

    const resetImage = () => setSelectedImage(null);

    const thumbnail = selectedImage
        ? URL.createObjectURL(selectedImage)
        : initialData?.images[0]
            ? `${serverAPI}/uploads/notes/${initialData?.images[0]}`
            : Placeholder;

    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-lg sm:max-w-3xl p-6 bg-white rounded-lg relative shadow-xl dark:border-gray-700 dark:bg-gray-800 max-h-screen overflow-y-auto">
                <Toaster />
                <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">
                    Update Note
                </h1>
                <form ref={UNForm} className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <InputComp
                        type="text"
                        placeholder="Enter Note Title"
                        name="title"
                        icon={<MdSubtitles />}
                        value={title}
                        className="w-full"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <img
                        src={thumbnail}
                        alt="Thumbnail Preview"
                        className="w-40 h-40 object-cover mt-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-md cursor-pointer"
                        onClick={resetImage}
                    />
                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <div
                        className="cursor-pointer bg-gray-200 py-2 px-4 rounded-lg text-lg font-semibold shadow-md dark:bg-gray-700 transition duration-200"
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        {selectedImage ? "Change Image" : "Add Thumbnail Image"}
                    </div>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1}
                        onChange={setContent}
                        className="border rounded-lg dark:text-black min-h-[200px] w-full"
                    />
                    <InputComp
                        type="text"
                        placeholder="Enter tags separated with commas (,)"
                        name="tags"
                        icon={<FaTags />}
                        value={tags}
                        className="w-full"
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 transition duration-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-400 hover:text-black transition duration-200"
                        >
                            Update Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;

}
