
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/itemDetails.module.css";

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Retrieve the inventory item using the id.
    const items = JSON.parse(localStorage.getItem("inventoryItems")) || [];
    const item = items.find((item) => item.id.toString() === id);

    // Sample orders for demonstration.
    const sampleOrders = [
        {
            id: 101,
            itemId: 1, 
            orderDetails: "Order for 50 units of Parle-G Biscuits",
            orderedBy: "John Doe",
        },
        {
            id: 102,
            itemId: 1,
            orderDetails: "Order for 30 units of Parle-G Biscuits",
            orderedBy: "Jane Smith",
        },
        {
            id: 103,
            itemId: 2,
            orderDetails: "Order for 20 units of Britannia Bread",
            orderedBy: "Alice Brown",
        },
    ];

    // Store sample orders in localStorage (for demo purposes).
    localStorage.setItem("orders", JSON.stringify(sampleOrders));

    // Retrieve orders from localStorage.
    // Each order should have an itemId that corresponds to the inventory item.
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    // Filter orders for the current item based on itemId.
    const itemOrders = orders.filter((order) => order.itemId?.toString() === id);

    if (!item) {
        return <p>Item not found.</p>;
    }

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate("/inventory")}>
                Back
            </button>
            <h2 className={styles.title}>{item.name} Details</h2>
            <div className={styles.detailSection}>
                <p>
                    <strong>Category:</strong> {item.category}
                </p>
                <p>
                    <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                    <strong>Price per Unit:</strong> {item.priceperunit}
                </p>
                <p>
                    <strong>Supplier: </strong>
                    <Link className={styles.link} to={`/suppliers/view/${item.supplierId}`}>
                        {item.supplier}
                    </Link>
                </p>
            </div>

            <div className={styles.section}>
                <h3>Orders:</h3>
                {itemOrders.length > 0 ? (
                    <ul className={styles.orderList}>
                        {itemOrders.map((order) => (
                            <li key={order.id} className={styles.orderCard}>
                                <p>
                                    <strong>Order Details:</strong> {order.orderDetails}
                                </p>
                                <p>
                                    <strong>Ordered By:</strong> {order.orderedBy}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No orders available.</p>
                )}
            </div>
        </div>
    );
};

export default ItemDetails;
