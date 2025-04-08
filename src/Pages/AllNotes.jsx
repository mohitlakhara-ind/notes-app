import React, { useEffect, useState, useCallback } from "react";
import NoteCard from "../Components/NoteCard";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Placeholder from "../assets/noimg.jpg";
import UpdateNote from "../Components/UpdateNote";
import ControlPanel from "../Components/ControlPanel";
import { useNavigate } from "react-router-dom";
import Animator from "../Components/Animator";

export default function AllNotes() {
    const serverAPI = import.meta.env.VITE_SERVER_API;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("latest");

    useEffect(() => {
        if (!token) {
            setError("Unauthorized! Please log in.");
            setLoading(false);
            return;
        }
        fetchNotes();
    }, [token]);

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${serverAPI}/notes/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(data);
        } catch (err) {
            setError("Failed to load notes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = useCallback((note) => {
        setSelectedNote(note);
        setIsUpdateOpen(true);
    }, []);

    const handleDelete = useCallback(async (id) => {
        try {
            await axios.delete(`${serverAPI}/notes/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prev) => prev.filter((note) => note._id !== id));
            toast.success("Note deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete note.");
        }
    }, [serverAPI, token]);

    const handleArchive = useCallback(async (id, isArchived) => {
        try {
            await axios.put(
                `${serverAPI}/notes/archive/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotes((prev) =>
                prev.map((note) =>
                    note._id === id ? { ...note, archived: !isArchived } : note
                )
            );

            toast.success(isArchived ? "Note unarchived successfully!" : "Note archived successfully!");
        } catch (error) {
            toast.error("Failed to update archive status.");
        }
    }, [serverAPI, token]);

    const handlePin = useCallback(async (id) => {
        try {
            await axios.put(`${serverAPI}/notes/pin/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setNotes((prev) =>
                prev.map((note) =>
                    note._id === id ? { ...note, pinned: !note.pinned } : note
                )
            );
            toast.success("Note pinned successfully!");
        } catch (error) {
            toast.error("Failed to pin note.");
        }
    }, [serverAPI, token]);

    const handleOpenNote = (id) => {
        navigate(`/note/${id}`);
    };

    const filteredNotes = notes
        .filter((note) => {
            if (filter === "archived") return note.archived;
            if (filter === "pinned") return note.pinned;
            return !note.archived;
        })
        .filter((note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortOrder === "title") return a.title.localeCompare(b.title);
            return 0;
        });

    return (
        <Animator>
            {token ? <>
                <div className="min-h-screen flex flex-col  items-center p-6">
                    <Toaster />
                    <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 text-center p-3 dark:text-white">
                        All Notes
                    </h2>

                    <ControlPanel
                        onSearch={(term) => setSearchTerm(term)}
                        onFilter={(filter) => setFilter(filter)}
                        onSort={(sort) => setSortOrder(sort)}
                    />

                    {loading && <div className="animate-pulse text-lg text-gray-500">Loading notes...</div>}
                    {error && <p className="text-red-500 text-lg">{error}</p>}

                    {!loading && !error && (
                        <div className="w-full max-w-5xl">
                            {filteredNotes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredNotes.map((note) => {
                                        const thumbnail = note.images[0]
                                            ? `${serverAPI}/uploads/notes/${note.images[0]}`
                                            : Placeholder;

                                        return (
                                            <NoteCard
                                                key={note._id}
                                                noteId={note._id}
                                                title={note.title}
                                                tags={note.tags}
                                                description={note.description}
                                                img={thumbnail}
                                                onDelete={handleDelete}
                                                onEdit={() => handleEdit(note)}
                                                onArchive={handleArchive}
                                                archived={note.archived}
                                                pinned={note.pinned}
                                                onPin={handlePin}
                                                openNote={handleOpenNote}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-lg">
                                    {filter === "archived"
                                        ? "No archived notes available."
                                        : "No active notes available."}
                                </p>
                            )}
                        </div>

                    )}


                    {isUpdateOpen && selectedNote && (
                        <UpdateNote
                            isOpen={isUpdateOpen}
                            onClose={() => setIsUpdateOpen(false)}
                            noteId={selectedNote._id}
                            initialData={selectedNote}
                        />
                    )}
                </div></>
                : <>
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-amber-100">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                            Unauthorized Access
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Please log in to access your notes.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                        >
                            Login Here
                        </button>
                    </div>
                </>

            }
        </Animator>
    );


}
