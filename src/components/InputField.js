import React from 'react';
import './InputField.css'; // Ensure this file exists and includes the required styles

const InputField = ({ id, label, type, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-['RfDewi-Expanded'] font-[700] leading-6 text-gray-900">
            {label}
        </label>
        <div className="mt-2">
            <input
                id={id}
                name={id}
                type={type}
                required
                autoComplete={autoComplete}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red sm:text-sm sm:leading-6"
            />
        </div>
    </div>
);

export default InputField;