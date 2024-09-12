import React from 'react';
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="bg-white h-[calc(100vh-4rem)] lg:flex md:w-56 md:flex-col hidden border-r-2 border-gray-200 float-left">
            <div className="flex-col pt-5 flex overflow-y-auto">
                <div className="h-full flex-col justify-between px-4 flex">
                    {/* Dashboard Links */}
                    <div className="space-y-4">
                        <div className="bg-top bg-cover space-y-1">
                            {[
                                { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',href: '/dashboard' },
                                { name: 'Products', icon: 'M17 9L13.9558 13.5662C13.5299 14.2051 12.5728 14.1455 12.2294 13.4587L11.7706 12.5413C11.4272 11.8545 10.4701 11.7949 10.0442 12.4338L7 17', href: '/products' },
                                { name: 'Orders', icon: 'M8 10L8 16M12 12V16M16 8V16', href: '/orders' },
                                { name: 'Site Settings', icon: 'M8 10L8 16M12 12V16M16 8V16', href: '/site-settings' },

                            ].map((item, index) => (
                                <a key={index} href={item.href} className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                                    <span className="flex items-center">
                                        <svg className="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                        <span>{item.name}</span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                

                </div>
            </div>
        </div>
    );
};

export default Sidebar;
