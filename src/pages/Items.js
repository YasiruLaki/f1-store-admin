import React, { useState, useEffect } from 'react';
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
    const [productsByCategory, setProductsByCategory] = useState({});
    const [productId, setProductId] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8888/.netlify/functions/fetchAdminProducts');
                const data = await response.json();
                setProductsByCategory(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);


    const generateId = () => {
        const randomId = Math.floor(10000 + Math.random() * 90000);
        const formattedId = `#${randomId}`;
        setProductId(formattedId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        generateId();

        const method = selectedProduct ? 'PUT' : 'POST'; // Use 'PUT' if a product is selected, otherwise 'POST'
        const url = selectedProduct
            ? `http://localhost:8888/.netlify/functions/submitItem` // Your Netlify function endpoint
            : `http://localhost:8888/.netlify/functions/submitItem`;

        const requestBody = {
            productID: selectedProduct ? selectedProduct.productID : productId, // Include productID only for update
            name,
            shortName,
            price,
            category,
            description,
            tags,
            images,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Product ${method === 'POST' ? 'created' : 'updated'} successfully!`);
                closeModal();
                window.location.reload();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };

    const handleProductClick = (product) => {
        setEditMode(true);
        setSelectedProduct(product);
        setProductId(product.productID);
        setName(product.name);
        setShortName(product.shortName);
        setPrice(product.price);
        setCategory(product.category);
        setDescription(product.description);
        setTags(product.tags);
        setImages(product.images);
        openModal();
    };

    const resetForm = () => {
        setEditMode(false);
        setSelectedProduct(null);
        setProductId('');
        setName('');
        setShortName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setTags([]);
        setImages([]);
    };

    return (
        <div>
            <Navbar />
            <Sidebar />
            <div className='main-content  px-[32px] mt-[40px] justify-between'>
                <div className="flex justify-between items-center mt-8">
                    <h1 className="px-[32px] text-gray-900 mb-2 font-['RfDewi-Expanded'] text-[30px] font-[800]">Products</h1>
                    <div className="flex items-center">
                        <label htmlFor="filter" className="text-sm font-medium text-gray-900 mr-2">
                            Filter by Category:
                        </label>
                        <select
                            id="filter"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
                        >
                            <option value="">All</option>
                            <option value="Tshirts">Tshirts</option>
                            <option value="Hoodies">Hoodies</option>
                            <option value="Jackets">Jackets</option>
                            <option value="Posters">Posters</option>
                            <option value="Boxers">Boxers</option>
                            <option value="Socks">Socks</option>
                            <option value="Phone Cases">Phone Cases</option>
                            <option value="Lanyards & Keyrings">Lanyards & Keyrings</option>
                        </select>
                        <button
                            onClick={() => {
                                resetForm();
                                openModal();
                            }}
                            className='ml-[10px] block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                            Add Items
                        </button>
                    </div>
                </div>
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
                                    {editMode ? 'Edit Product' : 'Create New Product'}
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
                                    {editMode ? 'Update' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white p-8 rounded-md w-full">
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto pt-0">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal ">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Id</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created at</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(productsByCategory).map(([category, products]) => (
                                    <React.Fragment key={category}>
                                        {products.map((product) => (
                                            <tr
                                                key={product.productID}
                                                onClick={() => handleProductClick(product)}
                                                className="cursor-pointer"
                                            >
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {product.productID}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                            <img
                                                                className="w-full h-full"
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                                {product.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {product.category}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {product.createdAt.split("T")[0]}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {product.orders}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Items;