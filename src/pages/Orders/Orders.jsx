// src/pages/Orders/Orders.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/orders.module.css";
import SearchBar from "../../components/SearchBar";
import RefreshButton from "../../components/RefreshButton";
import { formatDate } from "../../utils/validators";
import { getAllOrders } from "../../api/orders";
import { toast } from 'react-hot-toast';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      const sorted = Array.isArray(data) ?
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      setOrders(sorted || []);
    } catch (err) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const text = searchQuery.toLowerCase();
      return (
        order._id.toLowerCase().includes(text) ||
        (order.customerId?.name || "").toLowerCase().includes(text) ||
        (order.status || "").toLowerCase().includes(text) ||
        formatDate(order.createdAt, false).toLowerCase().includes(text)
      );
    });
  }, [orders, searchQuery]);

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

      <div className={styles.tableContainer}>
        {loading ? (
          <p className={styles.loading}>
             <div className={styles.spinner} />
          </p>
        ) : filteredOrders.length > 0 ? (
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
              {filteredOrders.map(order => {
                const statusKey = (order.status || "").toLowerCase();
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.customerId?.name ? order.customerId.name : "Deleted customer"}</td>
                    <td>₹{order.totalAmount.toFixed(2)}</td>
                    <td>{formatDate(order.createdAt, false)}</td>
                    <td>
                      <span className={`${styles.status} ${styles[statusKey]}`}>
                        {order.status || "—"}
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
        ) : (
          <p className={styles.error}>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;