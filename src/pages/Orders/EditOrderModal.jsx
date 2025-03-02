import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Orders/editOrderModal.module.css";

const EditOrderModal = ({ order, onSave, onCancel }) => {
    const [editedOrder, setEditedOrder] = useState({
        orderNumber: "",
        customer: "",
        items: "",
        totalAmount: "",
        orderStatus: "",
        orderDate: "",
    });

    useEffect(() => {
        if (order) {
            setEditedOrder(order);
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedOrder({ ...editedOrder, [name]: value });
    };

    const handleSave = () => {
        // Basic validation
        if (
            !editedOrder.orderNumber ||
            !editedOrder.customer ||
            !editedOrder.items ||
            !editedOrder.totalAmount ||
            !editedOrder.orderStatus ||
            !editedOrder.orderDate
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        // Parse numeric values if needed
        const updatedOrder = {
            ...editedOrder,
            items: parseInt(editedOrder.items, 10),
            totalAmount: parseFloat(editedOrder.totalAmount),
        };

        onSave(updatedOrder);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>Edit Order</h3>

                <div className={styles.inputWrapper}>
                    <label htmlFor="orderNumber">Order Number</label>
                    <input
                        id="orderNumber"
                        type="text"
                        name="orderNumber"
                        placeholder="Order Number"
                        value={editedOrder.orderNumber}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="customer">Customer Name</label>
                    <input
                        id="customer"
                        type="text"
                        name="customer"
                        placeholder="Customer Name"
                        value={editedOrder.customer}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="items">Number of Items</label>
                    <input
                        id="items"
                        type="number"
                        name="items"
                        placeholder="Number of Items"
                        value={editedOrder.items}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="totalAmount">Total Amount</label>
                    <input
                        id="totalAmount"
                        type="number"
                        name="totalAmount"
                        placeholder="Total Amount"
                        value={editedOrder.totalAmount}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="orderStatus">Order Status</label>
                    <select
                        id="orderStatus"
                        name="orderStatus"
                        value={editedOrder.orderStatus}
                        onChange={handleChange}
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="orderDate">Order Date</label>
                    <input
                        id="orderDate"
                        type="date"
                        name="orderDate"
                        placeholder="Order Date"
                        value={editedOrder.orderDate}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button className={styles.saveBtn} onClick={handleSave}>
                        Save
                    </button>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditOrderModal;
