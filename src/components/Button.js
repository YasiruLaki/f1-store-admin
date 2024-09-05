import React from 'react';

const Button = ({ children, type = 'button', className = '', ...props }) => (
    <button
        type={type}
        className={`flex w-full justify-center rounded-md bg-[#111111] px-3 py-1.5 font-['RfDewi-Expanded'] font-[700] items-center leading-6 text-white shadow-sm hover:bg-[#111111e7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default Button;