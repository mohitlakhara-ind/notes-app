import React from 'react'
import {Link} from 'react-router-dom'
export default function Navlink({ location, name, icon }) {
    return (
        <li>
            <Link
                to={location}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
                {icon}
                <span className="ms-3">{name}</span>
            </Link>
        </li>
    )
}
