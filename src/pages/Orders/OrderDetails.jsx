// pages/Orders/OrderDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/orderDetails.module.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  // Keep a local copy of the status so changes don't apply until user saves
  const [status, setStatus] = useState("");

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const foundOrder = orders.find((o) => String(o.id) === id);
      if (foundOrder) {
        setOrder(foundOrder);
        setStatus(foundOrder.orderStatus);
      } else {
        alert("Order not found");
        navigate("/orders");
      }
    } else {
      alert("No orders available");
      navigate("/orders");
    }
  }, [id, navigate]);

  if (!order) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Handle saving the new status to localStorage
  const handleSaveStatus = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.map((o) => {
      if (String(o.id) === id) {
        return { ...o, orderStatus: status };
      }
      return o;
    });
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    alert("Order status updated successfully!");
    navigate("/orders");
  };

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/orders")}>
        Back
      </button>
      <div className={styles.card}>
        <h2 className={styles.title}>Order Details</h2>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order ID:</span>
          <span className={styles.value}>{order.id}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order Number:</span>
          <span className={styles.value}>{order.orderNumber}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Customer:</span>
          <span className={styles.value}>{order.customer}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order Date:</span>
          <span className={styles.value}>{order.orderDate}</span>
        </div>

        {/* Editable status field */}
        <div className={styles.detailGroup}>
          <span className={styles.label}>Status:</span>
          <select
            className={styles.statusDropdown}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Total Amount:</span>
          <span className={styles.value}>{order.totalAmount}</span>
        </div>

        <div className={styles.itemsSection}>
          <h3>Ordered Items</h3>
          {order.orderedItems?.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
              <span className={styles.itemPrice}>Price: {item.price}</span>
            </div>
          ))}
        </div>

        <button className={styles.saveBtn} onClick={handleSaveStatus}>
          Save Status
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
