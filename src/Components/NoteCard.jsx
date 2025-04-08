import React from "react";
import { FaThumbtack, FaArchive, FaTrash, FaEdit } from "react-icons/fa";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import Animator from "./Animator";

export default function NoteCard({ archived, pinned, tags, noteId, title, description, img, onDelete, onPin, openNote, onArchive, onEdit }) {
    return (
        <Animator>
            <div className="relative flex flex-col md:flex-row w-full my-6 shadow-sm border rounded-lg 
                bg-white border-slate-200 dark:bg-[#1E1E2F] dark:border-[#2C2C38]">
                
                {img && (
                    <div className="relative p-2.5 md:w-2/5 shrink-0 overflow-hidden">
                        <img src={img} alt={title} className="h-full w-full rounded-md md:rounded-lg object-cover" />
                    </div>
                )}
                
                <div className="p-6 flex flex-col justify-between">
                    {tags.length > 0 && (
                        <div className="mb-4 rounded-full bg-[#4ECCA3] py-0.5 px-2.5 border border-transparent text-xs 
                            text-white shadow-sm w-20 text-center dark:bg-[#FF9F1C]">
                            {tags[0]}
                        </div>
                    )}
                    
                    <h4 className="mb-2 text-[#1A202C] text-xl font-semibold dark:text-[#EAEAEA]">{title}</h4>
                    <p className="mb-4 text-[#4A5568] leading-normal font-light dark:text-[#B0B0B0]">{description}</p>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#4A5568] dark:text-[#B0B0B0]">
                            Created on: {new Date().toLocaleDateString()}
                        </span>
                        <span className={`px-2 text-sm font-semibold ${pinned ? "text-[#FF6F61]" : "text-[#4A5568] dark:text-[#B0B0B0]"}`}>
                            {pinned ? "Pinned" : "Not Pinned"}
                        </span>
                    </div>
                    
                    <button
                        className="mt-3 w-full px-4 py-2 bg-[#3D5A80] hover:bg-[#0077B6] text-white 
                            text-sm font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-300 
                            dark:bg-[#FF9F1C] dark:hover:bg-[#FF6F61] dark:focus:ring-[#2C2C38]"
                        onClick={() => openNote(noteId)}
                    >
                        View Note
                    </button>
                </div>

                {/* Action Buttons */}
                <div className=" flex md:flex-col sm:flex-row sm:gap-x-10 bg-black/50 backdrop-blur-2xl top-2 right-1 space-y-2 p-3 rounded-lg shadow">
                    <button
                        onClick={() => onPin(noteId)}
                        className={`p-2  md:my-0 sm:my-3 text-white  hover:text-[#0077B6] dark:hover:text-[#4ECCA3] 
                            ${pinned ? "pined bg-[#FF9F1C] text-black dark:bg-[#4ECCA3] rounded-full" : ""}`}
                    >
                        <FaThumbtack />
                    </button>
                    <button
                        onClick={() => onArchive(noteId, archived)}
                        className={`p-2 text-white hover:text-[#FF6F61] dark:hover:text-[#FF9F1C] 
                            ${archived ? "pined bg-[#FF9F1C] text-black dark:bg-[#4ECCA3] rounded-full" : ""}`}
                    >
                        {archived ? <RiInboxUnarchiveFill /> : <FaArchive />}
                    </button>
                    <button onClick={() => onEdit(noteId)} className="p-2 text-white hover:text-[#4ECCA3] dark:hover:text-[#FF9F1C]">
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(noteId)} className="p-2 text-white hover:text-[#FF6F61] dark:hover:text-[#FF9F1C]">
                        <FaTrash />
                    </button>
                </div>
            </div>
        </Animator>
    );
}
