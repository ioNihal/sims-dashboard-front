// src/pages/Orders/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/PageStyles/Orders/orderDetails.module.css';
import { capitalize, formatDate } from '../../utils/validators';
import { deleteOrder, getOrderById, updateOrderStatus } from '../../api/orders';
import { toast } from 'react-hot-toast';


export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [originalStatus, setOriginalStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch order on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fetched = await getOrderById(id);
        setOrder(fetched);
        setStatus(fetched.status || 'pending');
        setOriginalStatus(fetched.status || 'pending');
      } catch (err) {
        toast.error(err.message || 'Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // Patch status and navigate back
  const patchStatus = async (newStatus) => {
    setSaving(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      toast.success('Status updated');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  // Back with unsaved‐changes guard
  const handleBack = () => {
    if (status !== originalStatus) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    }
    navigate('/orders');
  };

  const handleSave = () => patchStatus(status);
  const handleConfirm = () => patchStatus('confirmed');

  const handleDelete = async () => {
    if (!window.confirm('Really delete this order?')) return;
    setSaving(true);
    try {
      await deleteOrder(order._id);
      toast.success('Order deleted');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Failed to delete order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.skeleton} style={{ width: '60%' }} />
          <div className={styles.skeleton} style={{ width: '40%' }} />
          <div className={styles.skeleton} style={{ width: '80%' }} />
        </div>
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
            {order.customerId?.name
              ? capitalize(order.customerId.name)
              : 'Deleted customer'}
          </span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order Date:</span>
          <span className={styles.value}>{formatDate(order.createdAt)}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Total Amount:</span>
          <span className={styles.value}>₹{order.totalAmount.toFixed(2)}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Status:</span>
          {['cancelled', 'pending'].includes(status) ? (
            <span className={`${styles.value} ${styles[status]}`}>{status}</span>
          ) : (
            <select
              className={styles.statusDropdown}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={saving}
            >
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
          {/* <button className={styles.deleteBtn} onClick={handleDelete} disabled={saving}>
            {saving ? 'Deleting…' : 'Delete'}
          </button> */}
        </div>

        <div className={styles.itemsSection}>
          <h3>Ordered Items</h3>
          {order.orderProducts.map((item) => (
            <div key={item._id} className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>
                  {item.name
                    ? capitalize(item.name)
                    : '—'}
                </span>
                <span className={styles.itemCategory}>
                  {item.category
                    ? capitalize(item.category)
                    : '—'}
                </span>
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemQuantity}>
                  Qty: {item.quantity}
                </span>
                <span className={styles.itemPrice}>₹{item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
