import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Orders/orders.module.css";
import SearchBar from "../../components/SearchBar";
import EditOrderModal from "./EditOrderModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve orders from localStorage or initialize with sample data
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    // let parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
    if (storedOrders && storedOrders.length > 0) {
      setOrders(JSON.parse(storedOrders));
      setLoading(false);
    } else {
      const sampleOrders = [
        {
          id: 1,
          orderNumber: "ORD001",
          customer: "John Doe",
          items: 3,
          totalAmount: 150,
          orderStatus: "Pending",
          orderDate: "2025-02-28",
          orderedItems: [
            { id: 1, name: "Item A", quantity: 1, price: 50 },
            { id: 2, name: "Item B", quantity: 2, price: 50 }
          ]
        },
        {
          id: 2,
          orderNumber: "ORD002",
          customer: "Jane Smith",
          items: 5,
          totalAmount: 250,
          orderStatus: "Completed",
          orderDate: "2025-02-27",
          orderedItems: [
            { id: 3, name: "Item C", quantity: 3, price: 50 },
            { id: 4, name: "Item D", quantity: 2, price: 50 }
          ]
        },
        {
          id: 3,
          orderNumber: "ORD003",
          customer: "Alice Brown",
          items: 2,
          totalAmount: 80,
          orderStatus: "Cancelled",
          orderDate: "2025-02-26",
          orderedItems: [
            { id: 5, name: "Item E", quantity: 2, price: 40 }
          ]
        }
      ];
      // Save sample orders to localStorage immediately
      localStorage.setItem("orders", JSON.stringify(sampleOrders));
      // Mimic an async loading with a timeout
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

  const handleEditOrder = (updatedOrder) => {
    const updatedOrders = orders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    updateLocalStorage(updatedOrders);
    setIsEditModalOpen(false);
  };

  const handleDeleteOrder = (id) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    updateLocalStorage(updatedOrders);
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.orderStatus || "").toLowerCase().includes(searchQuery.toLowerCase())
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

      {isEditModalOpen && (
        <EditOrderModal
          order={selectedOrder}
          onSave={handleEditOrder}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

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
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items</th>
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
                  <td>{order.orderNumber}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.orderDate}</td>
                  <td>
                    <Link to={`/orders/${order.id}`}>
                      <button className={styles.viewBtn}>View</button>
                    </Link>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
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
