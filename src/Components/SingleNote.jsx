import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Note from "../Pages/Note";

const SingleNote = () => {
    const  objId  = useParams();
    const id=objId.noteId;
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serverAPI = import.meta.env.VITE_SERVER_API;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const { data } = await axios.get(`${serverAPI}/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNote(data);
            } catch (err) {
                setError("Failed to load note.");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return <Note note={note} />;
};

export default SingleNote;
