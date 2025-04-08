import React, { useState } from "react";

export default function ControlPanel({ onSearch, onFilter, onSort }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("latest");

    // Handle Search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    // Handle Filter Change
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        onFilter(e.target.value);
    };

    // Handle Sort Change
    const handleSortChange = (e) => {
        setSort(e.target.value);
        onSort(e.target.value);
    };

    return (
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 w-full md:w-1/3 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Filter Dropdown */}
            <select
                value={filter}
                onChange={handleFilterChange}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Notes</option>
                <option value="pinned">Pinned</option>
                <option value="archived">Archived</option>
            </select>

            {/* Sort Dropdown */}
            <select
                value={sort}
                onChange={handleSortChange}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Alphabetically (A-Z)</option>
            </select>
        </div>
    );
}
