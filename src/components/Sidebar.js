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
                                { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                { name: 'About', icon: 'M17 9L13.9558 13.5662C13.5299 14.2051 12.5728 14.1455 12.2294 13.4587L11.7706 12.5413C11.4272 11.8545 10.4701 11.7949 10.0442 12.4338L7 17' },
                                { name: 'Hero', icon: 'M8 10L8 16M12 12V16M16 8V16' },
                            ].map((item, index) => (
                                <a key={index} href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
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
                    
                    {/* Section Headers */}
                    {[
                        { header: 'Data', links: ['Folders', 'Alerts', 'Statistics'] },
                        { header: 'Contact', links: ['Forms', 'Agents', 'Customers'] },
                    ].map((section, index) => (
                        <div key={index}>
                            <p className="px-4 font-semibold text-xs tracking-widest text-gray-400 uppercase">{section.header}</p>
                            <div className="mt-4 bg-top bg-cover space-y-1">
                                {section.links.map((link, linkIndex) => (
                                    <a key={linkIndex} href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                                        <span className="flex items-center">
                                            <svg className="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" />
                                            <span>{link}</span>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Settings Section */}
                    <div className="mt-12 pb-4">
                        <div className="bg-top bg-cover space-y-1">
                            <a href="#" className="font-medium text-sm items-center rounded-lg text-gray-900 px-4 py-2.5 flex transition-all duration-200 hover:bg-gray-200 group cursor-pointer">
                                <span className="flex items-center">
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Settings</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
