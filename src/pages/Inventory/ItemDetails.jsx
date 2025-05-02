// src/pages/Inventory/ItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/itemDetails.module.css";
import { capitalize, formatDate } from "../../utils/validators";
import { getInventoryItemById, deleteInventoryItem } from "../../api/inventory";
import { getAllOrders } from "../../api/orders";
import { toast } from "react-hot-toast";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [itemOrders, setItemOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // first fetch the item
        const fetchedItem = await getInventoryItemById(id);
        if (!fetchedItem) {
          toast.error("Item not found");
          return navigate("/inventory");
        }
        setItem(fetchedItem);

        // then fetch orders
        let allOrders = [];
        try {
          allOrders = await getAllOrders();
        } catch (_e) {
          console.error("Could not load orders");
        }

        // guard orderProducts and filter
        const recent = (allOrders || [])
          .filter(order => Array.isArray(order.orderProducts) &&
            order.orderProducts.some(p => p.inventoryId?._id === id)
          )
          .sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setItemOrders(recent);
      } catch (err) {
        // only inventory lookup failures land here
        toast.error(err.message || "Failed to load item details");
        return navigate("/inventory");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteInventoryItem(id);
      toast.success("Item deleted");
      navigate("/inventory");
    } catch (err) {
      toast.error(err.message || "Error deleting item");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading item details...</p>
      </div>
    );
  }

  if (!item) return null;

  const supplierName = item.supplierName || "Deleted supplier";
  const statusLabel =
    item.quantity > item.threshold
      ? "In Stock"
      : item.quantity > 0
        ? "Low Stock"
        : "Out of Stock";

  return (
    <div className={styles.page}>
      <div className={styles.btnGroup}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/inventory")}
        >
          Back
        </button>
        {/* <button className={styles.deleteBtn} onClick={handleDelete}>
          Delete Item
        </button> */}
      </div>

      <h2 className={styles.title}>Product Details</h2>
      <div className={styles.card}>
        <div className={styles.detailSection}>
          <p>
            <strong>Status:</strong>{" "}
            <span className={
              statusLabel.replace(/\s+/g, "").toLowerCase() === "instock"
                ? styles.inStock
                : statusLabel === "Low Stock"
                  ? styles.lowStock
                  : styles.outOfStock
            }>
              {statusLabel}
            </span>
          </p>
          <p><strong>Product Name:</strong> {capitalize(item.productName)}</p>
          <p><strong>Category:</strong> {capitalize(item.category)}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Unit Price:</strong> ₹{item.productPrice.toFixed(2)}</p>
          <p><strong>Low Stock Threshold:</strong> {item.threshold}</p>
          <p>
            <strong>Supplier: </strong>
            <Link className={styles.link} to={`/suppliers/view/${item.supplierId}`}>
              {capitalize(supplierName)}
            </Link>
          </p>
          <p><strong>Created At:</strong> {formatDate(item.createdAt)}</p>
          <p><strong>Updated At:</strong> {formatDate(item.updatedAt)}</p>
        </div>

        <div className={styles.ordersSection}>
          <h3>Orders:</h3>
          {itemOrders.length > 0 ? (
            <ul className={styles.orderList}>
              {itemOrders.map(order => {
                const line = order.orderProducts.find(
                  p => p.inventoryId?._id === id
                );
                return (
                  <li key={order._id} className={styles.orderCard}>
                    <p>
                      <strong>Order ID:</strong>{" "}
                      <Link to={`/orders/${order._id}`}>{order._id}</Link>
                    </p>
                    <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                    <p>
                      <strong>Qty:</strong> {line.quantity} @ ₹{line.price.toFixed(2)}
                    </p>
                    <p><strong>Status:</strong> {order.status}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.noOrder}>No orders available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
