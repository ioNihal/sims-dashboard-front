// pages/Orders/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/orders.module.css";
import SearchBar from "../../components/SearchBar";
import { capitalize, formatDate } from "../../utils/validators";
import RefreshButton from "../../components/RefreshButton";
import { getAllOrders } from "../../api/orders";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const text = searchQuery.toLowerCase();
    return (
      order._id.includes(text) ||
      (order.customerId?.name || "").toLowerCase().includes(text) ||
      (order.status || "").toLowerCase().includes(text) ||
      formatDate(order.createdAt, false).toLowerCase().includes(text)
    );
  });


  return (
    <div className={styles.page}>
      <h1>Orders</h1>

      <div className={styles.actions}>
        <div className={styles.rightSide}>
          <SearchBar
            placeholder="Search orders..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <RefreshButton onClick={fetchOrders} loading={loading} />
        </div>
      </div>

      {error ? (
        <div className={styles.tableContainer}>
          <p className={styles.error}>Error: {error}</p>
        </div>
      ) : loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading orders...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusKey = order.status?.toLowerCase() || "unknown";
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{capitalize(order.customerId?.name) || "—"}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{formatDate(order.createdAt, false)}</td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[statusKey]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
