import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Orders.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [orderType, setOrderType] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [orderType]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`https://f1-store-backend.netlify.app/.netlify/functions/fetchAdminOrders?status=${orderType}`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch('https://f1-store-backend.netlify.app/.netlify/functions/updateOrderStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderID: orderId, status: newStatus }),
            });

            const responseBody = await response.json();

            if (response.ok) {
                alert("Order status updated successfully!");
                fetchOrders();
            } else {
                console.error("Failed to update order status:", responseBody);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const generateInvoice = (order) => {
        const doc = new jsPDF();
        const primaryColor = '#111111';
        const secondaryColor = '#000000';

        doc.setFontSize(20);
        doc.setTextColor(primaryColor);
        doc.text(`Invoice (${order.orderID})`, 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(secondaryColor);
        doc.text('F1 Madness Store', 20, 30);
        doc.text('contact@f1madness.com', 20, 35);

        doc.setDrawColor(secondaryColor);
        doc.line(20, 40, 190, 40);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(primaryColor);
        doc.text('Order Information:', 20, 52);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor('#000');
        doc.text(`Order ID: ${order.orderID}`, 20, 60);
        doc.text(`Date: ${order.createdAt.split('T')[0]}`, 20, 67);
        doc.text(`Status: ${order.status}`, 20, 74);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(primaryColor);
        doc.text('Customer Information:', 90, 52);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor('#000');
        doc.text(`Name: ${order.customer.name}`, 90, 60);
        doc.text(`Email: ${order.customer.email}`, 90, 67);
        doc.text(`Phone: ${order.customer.phoneNumber}`, 90, 74);

        const addressLines = doc.splitTextToSize(`Address: ${order.customer.address}`, 95);
        let addressY = 81;
        addressLines.forEach((line, index) => {
            doc.text(line, 90, addressY + (index * 7));
        });

        const lineY = addressY + (addressLines.length * 7) + 5;

        doc.line(20, lineY, 190, lineY);
        if (order.items) {
            doc.autoTable({
                startY: lineY + 10,
                head: [['Item', 'Size', 'Quantity', 'Price']],
                body: [
                    ...order.items.map(item => [item.name, item.size, item.quantity, `$${item.price}`]),
                    [{ content: 'Subtotal', colSpan: 3, styles: { halign: 'right' } }, `$${order.subTotal.toFixed(2)}`],
                    [{ content: 'Shipping Charge', colSpan: 3, styles: { halign: 'right' } }, `$${order.shipping.toFixed(2)}`],
                    [{ content: 'Discounts', colSpan: 3, styles: { halign: 'right' } }, `$${order.discount.toFixed(2)}`],
                    [{ content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${order.totalAmount.toFixed(2)}`],
                ],
                theme: 'grid',
                headStyles: { fillColor: primaryColor, textColor: '#ffffff' },
                styles: { lineColor: secondaryColor, lineWidth: 0.1 },
                alternateRowStyles: { fillColor: '#f3f4f6' },
            });
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(secondaryColor);
            doc.text(`Page ${i} of ${pageCount}`, 180, 290, { align: 'right' });
        }

        doc.save(`Invoice_${order.orderID}.pdf`);
    };

    const renderOrderStatus = (status) => {
        switch (status) {
            case 'Confirmed':
                return (
                    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                        <svg className="me-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        {status}
                    </dd>
                );
            case 'Dispatched':
                return (
                    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        <svg className="me-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                        {status}
                    </dd>
                );
            case 'Delivered':
                return (
                    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <svg className="me-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {status}
                    </dd>
                );
            case 'Cancelled':
                return (
                    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <svg className="me-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {status}
                    </dd>
                );
            default:
                return null;
        }
    };

    const handleSearch = (orders) => {
        if (!search) return orders;
        return orders.filter((order) =>
            order.orderID.toLowerCase().includes(search.toLowerCase())
        );
    };

    const filteredOrders = handleSearch(orders);

    return (
        <div className="orders">
            <Navbar />
            <Sidebar />
            <section className="py-8 antialiased md:py-16 lg:ml-[222px]">
                <div className="mx-auto px-[30px]">
                    <div className="mx-auto">
                        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                            <h2 className="text-gray-900 mb-2 font-['RfDewi-Expanded'] text-[30px] font-[800]">Manage Orders</h2>
                            <div className="mt-6 gap-4 sm:mt-0 sm:flex sm:items-center sm:justify-end">
                                <select
                                    id="order-type"
                                    className="block w-full min-w-[8rem] rounded-lg border bg-gray-50 p-2.5 text-sm"
                                    onChange={(e) => setOrderType(e.target.value)}
                                >
                                    <option value="all" selected>All orders</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className='search-bar'>
                            <input
                                type="text"
                                placeholder="Search for products"
                                className="p-3 border border-gray-300 rounded-lg w-full mb-[20px] mt-[30px]"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="mt-1 flow-root ">
                            <div className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="flex flex-wrap items-center gap-y-4 py-6">
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 ">Order ID:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 ">
                                                <a href="#" className="hover:underline">{order.orderID}</a>
                                            </dd>
                                        </dl>
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 ">Date:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900">{order.createdAt.split('T')[0]}</dd>
                                        </dl>
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500">Price:</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900">${order.totalAmount}</dd>
                                        </dl>
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500">Status:</dt>
                                            {renderOrderStatus(order.status)}
                                        </dl>
                                        <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-80 lg:items-center lg:justify-end gap-4">
                                            <button onClick={() => generateInvoice(order)} className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white">Invoice</button>
                                            <select
                                                className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                                                onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    // Ask for confirmation
                                                    const confirmChange = window.confirm(`Are you sure you want to update the status to "${newStatus}"?`);
                                                    if (confirmChange) {
                                                        updateOrderStatus(order.orderID, newStatus);
                                                    }
                                                }}
                                                value={order.status}
                                            >
                                                <option value="" disabled>Update Status</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Dispatched">Dispatched</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Orders;