import { Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./Components/Sidebar";
import Auth from "./Components/Auth";
import CreateNote from "./Pages/CreateNote";
import AllNotes from "./Pages/AllNotes";
import Profile from "./Pages/Profile";
import Settings from "./Components/Settings";
import SingleNote from "./Components/SingleNote";
import NotesHome from "./Pages/HomePage";

function App() {
  return (
    <div className="md:flex  bg-gray-100 dark:bg-gray-900 dark:text-amber-100 min-h-screen">
      {/* Sidebar (Hidden on Small Screens, Visible on Larger Screens) */}
      <Sidebar />

      {/* Main Content Area (Responsive) */}
      <div className="flex-1  md:ml-[200px] sm:ml-0 transition-all duration-300 bg-[#FFFFFF] dark:bg-[#121212]">
        <Routes>
          <Route path="/" element={<NotesHome />} />
          <Route path="/signin" element={<Auth type="signin" />} />
          <Route path="/signup" element={<Auth type="signup" />} />
          <Route path="/create-note" element={<CreateNote />} />
          <Route path="/all-notes" element={<AllNotes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/update-note/:noteId" element={<h1>Update Note</h1>} />
          <Route path="/note/:noteId" element={<SingleNote />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
