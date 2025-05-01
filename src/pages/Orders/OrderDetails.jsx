// pages/Orders/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/PageStyles/Orders/orderDetails.module.css';
import { capitalize, formatDate } from '../../utils/validators';
import { deleteOrder, getOrderById, updateOrderStatus } from '../../api/orders';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [originalStatus, setOriginalStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch order on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fetched = await getOrderById(id);
        setOrder(fetched);
        setStatus(fetched.status);
        setOriginalStatus(fetched.status);
      } catch (err) {
        console.error("Error loading order details:", err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Handle status patch
  const patchStatus = async (newStatus) => {
    setSaving(true);
    setError(null);
    try {
      await updateOrderStatus(order._id, newStatus);
      navigate('/orders');
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  // Back with unsaved‐changes guard
  const handleBack = () => {
    if (status !== originalStatus) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    navigate('/orders');
  };

  const handleSave = () => patchStatus(status);

  const handleConfirm = () => {
    // if (window.confirm('Are you sure you want to confirm this order?')) {
    //   patchStatus('confirmed');
    // }

    patchStatus('confirmed');
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Really delete this order?')) return;
    setError(null);
    try {
      await deleteOrder(orderId);
      alert('Order deleted');
      navigate('/orders');
    } catch (err) {
      console.error("Error deleting order:", err);
      setError(err.message || 'Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading details…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>Error: {error}</p>
        <button onClick={() => navigate('/orders')}>Back</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.btnGroup}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving || status === originalStatus}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Order Details</h2>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order ID:</span>
          <span className={styles.value}>{order._id}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Customer:</span>
          <span className={styles.value}>
            {capitalize(order.customerId?.name) || '—'}
          </span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order Date:</span>
          <span className={styles.value}>{formatDate(order.createdAt)}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Total Amount:</span>
          <span className={styles.value}>₹{order.totalAmount}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Status:</span>
          {['cancelled', 'pending'].includes(order.status) ? (
            <span className={`${styles.value} ${styles[order.status]}`}>
              {order.status}
            </span>
          ) : (
            <select
              className={styles.statusDropdown}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={saving}
            >
              {/* ensure current status is always an option */}
              <option value={originalStatus}>{originalStatus}</option>
              {['confirmed', 'shipped', 'delivered', 'cancelled']
                .filter((s) => s !== originalStatus)
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          )}
        </div>

        <div className={styles.deleteWrapper}>
          {order.status === 'pending' && (
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={saving}
            >
              {saving ? 'Confirming…' : 'Confirm Order'}
            </button>
          )}
          <button className={styles.deleteBtn} onClick={() => handleDelete(order._id)}>
            Delete
          </button>
        </div>

        <div className={styles.itemsSection}>
          <h3>Ordered Items</h3>
          {order.orderProducts.map((item) => (
            <div key={item._id} className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>
                  {capitalize(item.inventoryId?.productName) || '—'}
                </span>
                <span className={styles.itemCategory}>
                  {capitalize(item.inventoryId?.category) || '—'}
                </span>
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                <span className={styles.itemPrice}>₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
