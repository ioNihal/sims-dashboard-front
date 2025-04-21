// pages/Orders/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/orders.module.css";
import SearchBar from "../../components/SearchBar";
import { capitalize, formatDate } from '../../utils/validators'

const Orders = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://suims.vercel.app/api/orders');
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to fetch orders');
        setOrders(json.orders);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const filteredOrders = orders.filter(
    (order) =>
      String(order._id).includes(searchQuery) ||
      (order.customerId?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.status || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (formatDate(order.createdAt, false) || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className={styles.page}><p className={styles.loading}>Loading orders...</p></div>;
  // if (error) return <div className={styles.page}><p className={styles.erro}>Error: {error}</p></div>;

  return (
    <div className={styles.page}>
      <h1>Orders</h1>
      <div className={styles.actions}>
        <SearchBar
          className={styles.searchBar}
          placeholder="Search orders..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading orders...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order._id}</td>
                  <td>{capitalize(order.customerId?.name) || '—'}</td>
                  <td>&#8377;{order.totalAmount}</td>
                  <td>{formatDate(order.createdAt, false)}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[order.status ? order.status.toLowerCase() : ""]
                        }`}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
