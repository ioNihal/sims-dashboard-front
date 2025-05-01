// src/pages/Customers/CustomerDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customerDetails.module.css";
import { capitalize, formatDate } from "../../utils/validators";
import { getCustomerById } from "../../api/customers";
import { getAllOrders } from "../../api/orders";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // fetch customer + all orders in parallel
        const [cust, allOrders] = await Promise.all([
          getCustomerById(id),
          getAllOrders()
        ]);
        setCustomer(cust);

        // filter orders for this customer, sort newest first
        const custOrders = allOrders
          .filter(o => o.customerId?._id === id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(custOrders);
      } catch (err) {
        console.error("Error loading customer or orders:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading customer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => navigate("/customers")}>Back to list</button>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/customers")}>
        Back
      </button>

      <div className={styles.card}>
        <div className={styles.title}>Customer Details</div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name:</span>
            <span className={styles.detailValue}>{capitalize(customer.name)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailValue}>{customer.email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone:</span>
            <span className={styles.detailValue}>{customer.phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Address:</span>
            <span className={styles.detailValue}>{capitalize(customer.address)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Payment Pref.:</span>
            <span className={styles.detailValue}>{capitalize(customer.paymentPreference)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Created At:</span>
            <span className={`${styles.detailValue} ${styles.date}`}>
              {formatDate(customer.createdAt)}
            </span>
          </div>
        </div>

        
        <div className={styles.ordersSection}>
          <h3>Recent Orders</h3>
          {orders.length > 0 ? (
            <ul className={styles.orderList}>
              {orders.map(order => (
                <li key={order._id} className={styles.orderCard}>
                  <p>
                    <strong>Order ID:</strong>{" "}
                    <Link to={`/orders/${order._id}`}>{order._id}</Link>
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>
                  <p>
                    <strong>Status:</strong> {capitalize(order.status)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noOrder}>This customer has no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
