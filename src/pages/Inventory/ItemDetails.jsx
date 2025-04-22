// src/pages/Inventory/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/itemDetails.module.css";
import { capitalize, formatDate } from "../../utils/validators";
import { getInventoryItemById } from "../../api/inventory";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [itemOrders, setItemOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const fetchedItem = await getInventoryItemById(id);
        setItem(fetchedItem);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Item not found. Try again later!");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);


  // Set orders if present
  // if (orders) {
  //   setItemOrders(orders);
  // }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/inventory")}>
        Back
      </button>
      <h2 className={styles.title}>Product Details</h2>
      <div className={styles.card}>
        <div className={styles.detailSection}>
          <p><strong>Status:</strong> <span
            style={{ color: item.quantity > item.threshold ? "green" : item.quantity > 0 ? "orange" : "red" }}>
            {`${item.quantity > item.threshold ? "In Stock" : item.quantity > 0 ? "Low Stock" : "Out of Stock"}`}
          </span>
          </p>
          <p><strong>Product Name:</strong> {capitalize(item.productName)}</p>
          <p><strong>Category:</strong> {capitalize(item.category)}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Unit Price:</strong> &#8377;{item.productPrice}</p>
          <p><strong>Low Stock Threshold:</strong> {item.threshold}</p>
          <p>
            <strong>Supplier: </strong>
            <Link className={styles.link} to={`/suppliers/view/${item.supplierId}`}>
              {capitalize(item.supplierName)}
            </Link>
          </p>
          <p><strong>Created At:</strong> {formatDate(item.createdAt)}</p>
          <p><strong>Updated At:</strong> {formatDate(item.updatedAt)}</p>
        </div>

        <div className={styles.ordersSection}>
          <h3>Orders:</h3>
          {itemOrders.length > 0 ? (
            <ul className={styles.orderList}>
              {itemOrders.map((order, index) => (
                <li key={index} className={styles.orderCard}>
                  <p><strong>Order Details:</strong> {order.orderDetails}</p>
                  <p><strong>Ordered By:</strong> {order.orderedBy}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noOrder}>No orders available.</p>
          )}
        </div>
      </div>
    </div >
  );
};

export default ItemDetails;
