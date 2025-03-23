// pages/Orders/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/orders.module.css";
import SearchBar from "../../components/SearchBar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve orders from localStorage or initialize with sample data
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders && storedOrders.length > 0) {
      setOrders(JSON.parse(storedOrders));
      setLoading(false);
    } else {
      const sampleOrders = [
        {
          id: 1,
          orderNumber: "ORD001",
          customer: "Alice Johnson",
          items: 3,
          totalAmount: 200,
          orderStatus: "Pending",
          orderDate: "2025-02-28",
          orderedItems: [
            { id: 1, name: "Item A", quantity: 1, price: 70 },
            { id: 2, name: "Item B", quantity: 2, price: 65 },
          ],
        },
        {
          id: 2,
          orderNumber: "ORD004",
          customer: "Alice Johnson",
          items: 3,
          totalAmount: 200,
          orderStatus: "Completed",
          orderDate: "2025-01-28",
          orderedItems: [
            { id: 3, name: "Item A", quantity: 1, price: 70 },
            { id: 4, name: "Item B", quantity: 2, price: 65 },
            { id: 5, name: "Item C", quantity: 1, price: 70 },
            { id: 6, name: "Item D", quantity: 2, price: 100 },
          ],
        },
        {
          id: 3,
          orderNumber: "ORD002",
          customer: "Bob Smith",
          items: 4,
          totalAmount: 300,
          orderStatus: "Completed",
          orderDate: "2025-02-27",
          orderedItems: [
            { id: 7, name: "Item E", quantity: 2, price: 100 },
            { id: 8, name: "Item D", quantity: 2, price: 50 },
          ],
        },
        {
          id: 4,
          orderNumber: "ORD003",
          customer: "Carol Lee",
          items: 2,
          totalAmount: 150,
          orderStatus: "Cancelled",
          orderDate: "2025-02-26",
          orderedItems: [
            { id: 9, name: "Item E", quantity: 2, price: 75 },
          ],
        },
      ];
      localStorage.setItem("orders", JSON.stringify(sampleOrders));
      setTimeout(() => {
        setOrders(sampleOrders);
        setLoading(false);
      }, 1000);
    }
  }, []);

  const updateLocalStorage = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleDeleteOrder = (id) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    updateLocalStorage(updatedOrders);
  };

  const filteredOrders = orders.filter(
    (order) =>
      String(order.id).includes(searchQuery) ||
      (order.customer || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.orderStatus || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.orderDate || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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
                <th>ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.totalAmount}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[order.orderStatus ? order.orderStatus.toLowerCase() : ""]
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{order.orderDate}</td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
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
