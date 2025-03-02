import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/viewOrder.module.css";

const ViewOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const foundOrder = orders.find((o) => String(o.id) === id);
        setOrder(foundOrder);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div className={styles.page}>
                <p className={styles.loading}>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.page}>
                <p className={styles.error}>Order not found.</p>
                <Link to="/orders">
                    <button className={styles.backBtn}>Back to Orders</button>
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1>Order Details</h1>
            <div className={styles.details}>
                <p>
                    <strong>Order Number:</strong> {order.orderNumber}
                </p>
                <p>
                    <strong>Customer:</strong> {order.customer}
                </p>
                <p>
                    <strong>Total Items:</strong> {order.items}
                </p>
                <p>
                    <strong>Total Amount:</strong> ${order.totalAmount}
                </p>
                <p>
                    <strong>Status:</strong> {order.orderStatus}
                </p>
                <p>
                    <strong>Order Date:</strong> {order.orderDate}
                </p>
            </div>

            {order.orderedItems && order.orderedItems.length > 0 && (
                <div className={styles.orderedItems}>
                    <h2>Ordered Items</h2>
                    <table className={styles.itemsTable}>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price (each)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderedItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Link to="/orders">
                <button className={styles.backBtn}>Back to Orders</button>
            </Link>
        </div>
    );
};

export default ViewOrder;
