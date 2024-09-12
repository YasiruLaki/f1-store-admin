import React, { useEffect, useState } from 'react';
import './Settings.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Select from 'react-select';

function Settings() {
    const [siteAnnouncement, setSiteAnnouncement] = useState('');
    const [bestSellingProducts, setBestSellingProducts] = useState({
        product1: null,
        product2: null,
        product3: null
    });
    const [remainingChars, setRemainingChars] = useState(60);
    const [allProducts, setAllProducts] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    // Convert product objects into options format for react-select
    const createProductOptions = (products) => {
        return products.map((product) => ({
            value: product.productID,
            label: product.name,
        }));
    };

    const fetchSiteSettings = async () => {
        try {
            const response = await fetch('http://localhost:8888/.netlify/functions/fetchSiteSettings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            // Map product IDs to product options
            const mapProductIdToOption = (id) => {
                const product = allProducts.find(p => p.productID === id);
                return product ? { value: product.productID, label: product.name } : null;
            };

            setSiteAnnouncement(data.siteAnnouncement);

            setBestSellingProducts({
                product1: mapProductIdToOption(data.bestSellingProducts.product1),
                product2: mapProductIdToOption(data.bestSellingProducts.product2),
                product3: mapProductIdToOption(data.bestSellingProducts.product3),
            });

        } catch (error) {
            console.error('Error fetching site settings:', error);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:8888/.netlify/functions/fetchAdminProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            // Flatten the object values into a single array
            const flattenedProducts = Object.values(data).flat();
            setAllProducts(flattenedProducts);
            setProductOptions(createProductOptions(flattenedProducts));
        } catch (error) {
            console.error('Error fetching all products:', error);
        }
    };

    const updateSiteSettings = async () => {
        try {
            // Map bestSellingProducts to only include the product IDs (values)
            const updatedBestSellingProducts = {
                product1: bestSellingProducts.product1 ? bestSellingProducts.product1.value : null,
                product2: bestSellingProducts.product2 ? bestSellingProducts.product2.value : null,
                product3: bestSellingProducts.product3 ? bestSellingProducts.product3.value : null,
            };
    
            const response = await fetch('http://localhost:8888/.netlify/functions/fetchSiteSettings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ siteAnnouncement, bestSellingProducts: updatedBestSellingProducts }),
            });
            const data = await response.json();
            console.log('Site settings updated:', data);
        } catch (error) {
            console.error('Error updating site settings:', error);
        }
    };

    const handleAnnouncementChange = (event) => {
        const value = event.target.value;
        setSiteAnnouncement(value);
        setRemainingChars(60 - value.length);
    };

    const handleProductChange = (selectedOption, index) => {
        const updatedProducts = { ...bestSellingProducts };
        switch (index) {
            case 0:
                updatedProducts.product1 = selectedOption;
                break;
            case 1:
                updatedProducts.product2 = selectedOption;
                break;
            case 2:
                updatedProducts.product3 = selectedOption;
                break;
            default:
                break;
        }
        setBestSellingProducts(updatedProducts);
    };

    useEffect(() => {
        fetchAllProducts().then(() => {
            fetchSiteSettings();
        });
    }, []);

    return (
        <div className="settings">
            <Navbar />
            <Sidebar />
            <section className="bg-white px-[30px] lg:ml-[222px]">
                <div className="py-8 px-4 mx-auto lg:py-16 ">
                    <h2 className="text-gray-900 mb-2 font-['RfDewi-Expanded'] text-[30px] font-[800]">Site Settings</h2>
                    <div className="grid gap-4 sm:grid-cols-3 sm:gap-6 mt-[40px]">
                        <div className="sm:col-span-3">
                            <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900 ">Update Website Announcement:<i className='text-sm'> (Remaining: {remainingChars} Characters)</i></label>
                            <div className='flex justify-between'>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={siteAnnouncement}
                                    onChange={handleAnnouncementChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Type Website Announcement Here"
                                    maxLength={60}
                                />
                                <button
                                    onClick={updateSiteSettings}
                                    className="ml-[10px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
                                >Update
                                </button>
                            </div>
                        </div>
                        <label htmlFor="name" className="sm:col-span-3 block text-lg font-medium text-gray-900 mt-[20px] mb-[0px]">Update Best Seller Products:</label>

                        {/* Product 1 */}
                        <div>
                            <label htmlFor="product1" className="block mb-2 text-sm font-medium text-gray-900 mt-[-10px]">Product 1</label>
                            <Select
                                id="product1"
                                name="product1"
                                options={productOptions}
                                value={bestSellingProducts.product1}
                                onChange={(selectedOption) => handleProductChange(selectedOption, 0)}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Search for a product..."
                            />
                        </div>

                        {/* Product 2 */}
                        <div>
                            <label htmlFor="product2" className="block mb-2 text-sm font-medium text-gray-900 mt-[-10px]">Product 2</label>
                            <Select
                                id="product2"
                                name="product2"
                                options={productOptions}
                                value={bestSellingProducts.product2}
                                onChange={(selectedOption) => handleProductChange(selectedOption, 1)}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Search for a product..."
                            />
                        </div>

                        {/* Product 3 */}
                        <div>
                            <label htmlFor="product3" className="block mb-2 text-sm font-medium text-gray-900 mt-[-10px]">Product 3</label>
                            <Select
                                id="product3"
                                name="product3"
                                options={productOptions}
                                value={bestSellingProducts.product3}
                                onChange={(selectedOption) => handleProductChange(selectedOption, 2)}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Search for a product..."
                            />
                        </div>
                        <button
                            onClick={updateSiteSettings}
                            className="ml-[10px] inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
                        >Update
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Settings;