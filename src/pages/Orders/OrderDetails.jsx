import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/PageStyles/Orders/orderDetails.module.css';
import { capitalize, formatDate } from '../../utils/validators';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://suims.vercel.app/api/orders?orderId=${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to load order');
        const [fetched] = json.orders;
        if (!fetched) throw new Error('Order not found');
        setOrder(fetched);
        setStatus(fetched.status);
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`https://suims.vercel.app/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Save failed');
      alert('Order status updated!');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async orderId => {
    if (!window.confirm('Really delete this order?')) return;
    try {
      const res = await fetch(
        `https://suims.vercel.app/api/orders/${orderId}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Delete failed');
      navigate('/orders');
      alert('Order deleted');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading details…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.btnGroup}>
        <button className={styles.backButton} onClick={() => navigate('/orders')}>
          Back
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Order Details</h2>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order ID:</span>
          <span className={styles.value}>{order._id}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Customer:</span>
          <span className={styles.value}>{capitalize(order.customerId?.name) || '—'}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Order Date:</span>
          <span className={styles.value}>
            {formatDate(order.createdAt)}
          </span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Total Amount:</span>
          <span className={styles.value}>₹{order.totalAmount}</span>
        </div>

        <div className={styles.detailGroup}>
          <span className={styles.label}>Status:</span>
          {order.status === 'cancelled' ?
            (<span className={`${styles.value} ${styles.cancelled}`}>{order.status}</span>) :
            (<select
              className={styles.statusDropdown}
              value={status}
              onChange={e => setStatus(e.target.value)}
              disabled={saving}
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>)}
        </div>

        <div className={styles.deleteWrapper}>
          <button className={styles.deleteBtn} onClick={() => handleDelete(order._id)}>
            Delete
          </button>
        </div>

        <div className={styles.itemsSection}>
          <h3>Ordered Items</h3>
          {order.orderProducts.map(item => (
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
