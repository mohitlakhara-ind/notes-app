import React from "react";
import { useNavigate } from "react-router-dom";
import Placeholder from "../assets/noimg.jpg";
import Animator from "../Components/Animator";


const Note = ({ note }) => {
  const navigate = useNavigate();
  const serverAPI = import.meta.env.VITE_SERVER_API;
  const thumbnail = note.images.length > 0
    ? `${serverAPI}/uploads/notes/${note.images[0]}`
    : Placeholder;
  return (
    <Animator>
      <div className="relative bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#4ecca3] dark:hover:border-[#ff6f61] p-4">
        {/* Thumbnail Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={thumbnail}
            alt={note.title}
            className="w-full h-auto object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Note Content */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#eaeaea] mb-2 transition-all duration-300 hover:text-[#4ecca3] dark:hover:text-[#ff6f61]">
            {note.title}
          </h2>
          <p className="text-gray-600 dark:text-[#b0b0b0] text-sm leading-relaxed">
            {note.description}
          </p>
          <div >
            <div dangerouslySetInnerHTML={{ __html: note.content }} />

          </div>
          <div className="mt-3 flex justify-between items-center text-xs text-[#4ecca3] dark:text-[#ff6f61]">
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="my-6 text-center">
        <p className="text-gray-600 dark:text-[#b0b0b0]">Do you want to see more? Or create a new one?</p>

        <div className="flex justify-center gap-4 mt-3">
          <button
            className="bg-[#4ecca3] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3ca58f] transition duration-300"
            onClick={() => navigate("/all-notes")}
          >
            View More
          </button>

          <button
            className="bg-[#ff6f61] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#e85c50] transition duration-300"
            onClick={() => navigate("/create-note")}
          >
            Create New Note
          </button>
        </div>
      </div>
    </Animator>
  );
};

export default Note;
