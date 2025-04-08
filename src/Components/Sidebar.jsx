import React, { useState, useRef, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaRegEdit } from 'react-icons/fa';
import { IoIosHome } from 'react-icons/io';
import { GrNotes } from 'react-icons/gr';
import { MdDeveloperMode } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Navlink from './Navlink';
import ProfileNav from './ProfileNav';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);

    const handleToggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <button
                onClick={handleToggleSidebar}
                aria-controls="logo-sidebar"
                type="button"
                className={`p-2 sm:absolute mt-2 ms-3 text-sm rounded-lg sm:none bg-light-secondary dark:bg-dark-secondary text-light-primary dark:text-dark-primary hover:bg-light-accent dark:hover:bg-dark-accent md:hidden lg:hidden focus:outline-none focus:ring-2 focus:ring-light-highlight dark:focus:ring-dark-highlight ${isOpen ? '-translate-x-full': 'translate-x-0'} transition-transform duration-300`}>
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                </svg>
            </button>

            <aside
                ref={sidebarRef}
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-50 h-screen border-r-2 border-b-gray-900 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-light-secondary dark:bg-dark-secondary text-light-primary dark:text-dark-primary backdrop-blur-3xl`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto flex flex-col justify-between">
                    <Link to="/" className="flex items-center ps-2.5 border-b border-light-border dark:border-dark-border p-5 mb-5">
                        <GrNotes className="text-2xl mx-1" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap">NoteNow</span>
                    </Link>

                    <ul className="space-y-2 border-b border-light-border dark:border-dark-border py-10 font-medium">
                        <Navlink location='/' name="Home" icon={<IoIosHome />} />
                        <Navlink location='/create-note' name="Create Note" icon={<FaRegEdit />} />
                        <Navlink location='/all-notes' name="My Notes" icon={<GrNotes />} />
                    </ul>

                    <ProfileNav />

                    <div className="footer border-t border-light-border dark:border-dark-border p-5">
                        <div className="flex justify-center space-x-4 my-3">
                            <a href="https://github.com/mohitlakhara-ind" target="_blank" rel="noopener noreferrer" className="hover:text-light-highlight dark:hover:text-dark-highlight">
                                <FaGithub className="text-xl" />
                            </a>
                            <a href="https://linkedin.com/in/mohitlakhara-ind" target="_blank" rel="noopener noreferrer" className="hover:text-light-highlight dark:hover:text-dark-highlight">
                                <FaLinkedin className="text-xl" />
                            </a>
                            <a href="https://instagram.com/in/webdev_mohit" target="_blank" rel="noopener noreferrer" className="hover:text-light-highlight dark:hover:text-dark-highlight">
                                <FaInstagram className="text-xl" />
                            </a>
                            <a href="https://mohitlakhara.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-light-highlight dark:hover:text-dark-highlight">
                                <MdDeveloperMode className="text-xl" />
                            </a>
                        </div>
                        <p className="text-xs text-center">
                            © {new Date().getFullYear()} NoteNow.<br /> All rights reserved.
                        </p>
                        <p className='text-xs text-center'>
                            Made with ❤️ by <strong>Mohit</strong>
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}
