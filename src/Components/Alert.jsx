import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const Alert = ({ type, message }) => {
    const getAlertClass = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-400';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-400';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-400';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <FaCheckCircle className="text-green-600" />;
            case 'error':
                return <FaTimesCircle className="text-red-600" />;
            case 'warning':
                return <FaExclamationTriangle className="text-yellow-600" />;
            default:
                return <FaInfoCircle className="text-blue-600" />;
        }
    };

    const handleClose = () => {
        const alertElement = document.querySelector('.alert-container');
        if (alertElement) {
            alertElement.style.opacity = '0';
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 300); // Match the CSS transition duration
        }
    };

    setTimeout(() => {
        handleClose();
    }, 3000);

    return (
        <div
            className={`alert-container flex items-center border-l-4 p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${getAlertClass(
                type
            )}`}
            style={{ opacity: 1 }}
        >
            <span className="mr-3">{getIcon(type)}</span>
            <span className="font-medium flex-grow">{message}</span>
            <button
                onClick={handleClose}
                className="ml-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
            >
                <IoIosCloseCircleOutline className="text-xl" />
            </button>
        </div>
    );
};

export default Alert;
