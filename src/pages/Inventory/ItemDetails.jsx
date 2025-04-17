// src/pages/Inventory/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/itemDetails.module.css";
import { capitalize } from "../../utils/validators";

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
        const res = await fetch(`https://suims.vercel.app/api/inventory/${id}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();
        const fetchedItem = data.inventory || data;
        setItem(fetchedItem);

        // Set orders if present
        if (fetchedItem.orders) {
          setItemOrders(fetchedItem.orders);
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Item not found. Try again later!");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

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

      <div className={styles.detailSection}>
        <p><strong>Status:</strong> <span
          style={{ color: item.quantity > 50 ? "green" : item.quantity > 0 ? "orange" : "red" }}>
          {`${item.quantity > 50 ? "In Stock" : item.quantity > 0 ? "Low Stock" : "Out of Stock"}`}
        </span>
        </p>
        <p><strong>Product Name:</strong> {capitalize(item.productName)}</p>
        <p><strong>Category:</strong> {capitalize(item.category)}</p>
        <p><strong>Quantity:</strong> {item.quantity}</p>
        <p><strong>Unit Price:</strong> {item.priceperitem}</p>
        <p>
          <strong>Supplier: </strong>
          <Link className={styles.link} to={`/suppliers/view/${item.supplierId}`}>
            {capitalize(item.supplierName)}
          </Link>
        </p>
      </div>

      <div className={styles.section}>
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
    </div >
  );
};

export default ItemDetails;
