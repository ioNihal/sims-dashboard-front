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
                <input
                    type="text"
                    name="orderNumber"
                    placeholder="Order Number"
                    value={editedOrder.orderNumber}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <input
                    type="text"
                    name="customer"
                    placeholder="Customer Name"
                    value={editedOrder.customer}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <input
                    type="number"
                    name="items"
                    placeholder="Number of Items"
                    value={editedOrder.items}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="totalAmount"
                    placeholder="Total Amount"
                    value={editedOrder.totalAmount}
                    onChange={handleChange}
                />
                <select
                    name="orderStatus"
                    value={editedOrder.orderStatus}
                    onChange={handleChange}
                >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <input
                    type="date"
                    name="orderDate"
                    placeholder="Order Date"
                    value={editedOrder.orderDate}
                    onChange={handleChange}
                />
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
