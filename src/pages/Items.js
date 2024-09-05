import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Items() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const trimmedValue = inputValue.trim();
            if (trimmedValue && !tags.includes(trimmedValue)) {
                setTags([...tags, trimmedValue]);
                setInputValue('');
            }
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    };

    const openCloudinaryWidget = () => {
        const widget = window.cloudinary.openUploadWidget(
            {
                cloudName: 'drj8voqyf',
                uploadPreset: 'f1-store-products',
                sources: ['local', 'url'],
                showAdvancedOptions: true,
                cropping: false,
                multiple: true,
                theme: 'white'
            },
            (error, result) => {
                if (result && result.event === 'success') {
                    setImages(prevImages => [...prevImages, result.info.secure_url]);
                }
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name,
            shortName,
            price,
            category,
            description,
            tags: JSON.stringify(tags),
            images: images, // Include the image URLs here
        };

        try {
            const response = await fetch('https://f1-store-backend.netlify.app/.netlify/functions/submitItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }

            const result = await response.json();
            console.log('Success:', result);
            closeModal(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className='main-content'>
                <button
                    onClick={openModal}
                    className='block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                    Add Items
                </button>
            </div>

            {isModalOpen && (
                <div
                    id="crud-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                >
                    <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow">
                        <div className="relative bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Create New Product
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                    onClick={closeModal}
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder="Type product name"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="shortName"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Short Name
                                        </label>
                                        <input
                                            type="text"
                                            name="shortName"
                                            id="shortName"
                                            value={shortName}
                                            onChange={(e) => setShortName(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder="Give a short name"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label
                                            htmlFor="price"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder="$2999"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label
                                            htmlFor="category"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                        >
                                            <option value="" disabled>Select category</option>
                                            <option value="Tshirts">Tshirts</option>
                                            <option value="Hoodies">Hoodies</option>
                                            <option value="Jackets">Jackets</option>
                                            <option value="Posters">Posters</option>
                                            <option value="Boxers">Boxers</option>
                                            <option value="Socks">Socks</option>
                                            <option value="Phone Cases">Phone Cases</option>
                                            <option value="Lanyards & Keyrings">Lanyards & Keyrings</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Product Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="4"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Write product description here"
                                        ></textarea>
                                    </div>
                                </div>

                                <div
                                    onClick={openCloudinaryWidget}
                                    className="p-4 border border-dashed border-gray-300 rounded-lg text-center cursor-pointer"
                                >
                                    <p>Click here to upload images</p>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                            <img
                                                src={url}
                                                alt={`uploaded-image-${index}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor="tags"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Tags
                                    </label>
                                    <input
                                        id="tags"
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Press Enter to add tags"
                                    />
                                    <div className="mt-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full mr-2 mb-2"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    className="ml-2 text-white"
                                                    onClick={() => handleDeleteTag(tag)}
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Items;