import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Animator from './Animator';

const InputComp = ({
    icon,
    type = "text",
    value,
    onChange, // Only define once
    placeholder = "",
    name,
    required = false,
    accept = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (event) => {
        onChange && onChange(event); // Pass the full event instead of just event.target.value
    };
    


    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const isPasswordField = type === "password";

    return (
        <Animator>

            <div className="flex items-center gap-2 p-2 border border-gray-600 rounded-lg focus-within:border-blue-500 transition duration-200">
                {icon && <span className="text-gray-500 dark:text-amber-100">{icon}</span>}
                <input
                    className="w-full p-2 outline-none bg-transparent dark:bg-gray-800 dark:text-amber-100 text-gray-800 placeholder-gray-400 focus:ring-0"
                    type={isPasswordField && showPassword ? "text" : type}
                    value={value}
                    onChange={handleInputChange} // Corrected onChange
                    placeholder={placeholder}
                    name={name}
                    required={required}
                    accept={accept}
                    aria-label={placeholder}
                    autoComplete={isPasswordField ? "current-password" : "off"}
                    autoCorrect="off"
                />
                {isPasswordField && (
                    <button
                        type="button"
                        className="text-gray-500 focus:outline-none"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide Password" : "Show Password"}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
        </Animator>
    );
};

export default InputComp;
