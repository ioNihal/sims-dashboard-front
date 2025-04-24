// src/components/Feedbacks.jsx
import React, { useEffect, useState } from 'react';
import styles from '../../styles/PageStyles/Feedbacks/feedbacks.module.css';
import { useNavigate } from 'react-router-dom';
import { getAllFeedbacks, deleteFeedbackById } from '../../api/feedbacks';
import RefreshButton from '../../components/RefreshButton';
import SearchBar from '../../components/SearchBar';
import { getCustomerById } from '../../api/customers';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const all = await getAllFeedbacks(); 
    
      const enriched = await Promise.all(
  all.map(async fb => {
    if (fb.senderType === 'customer') {
      try {
        const cust = await getCustomerById(fb.customerId);
        return { ...fb, senderName: cust.name };
      } catch (err) {
        console.warn(`Failed to fetch customer ${fb.customerId}:`, err);
        return { ...fb, senderName: 'Unknown Customer' };
      }
    } else {
      return { ...fb, senderName: 'Staff' };
    }
  })
);

      setFeedbacks(enriched);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await deleteFeedbackById(id);
      setFeedbacks(fs => fs.filter(f => f._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f =>
    f.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Feedbacks</h1>
      <div className={styles.actions}>
        <div className={styles.rightSide}>
          <SearchBar
            placeholder="Search name, keywords..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <RefreshButton onClick={fetchFeedbacks} loading={loading} />
        </div>
      </div>

      <div className={styles.listContainer}>
        {loading ? (
          <div className={styles.message}>Loading feedbacks…</div>
        ) : (
          <ul className={styles.list}>
            {filteredFeedbacks.map(fb => (
              <li key={fb._id} className={styles.card}>
                <div className={styles.meta}>
                  <span><strong>From:</strong> {fb.senderName}</span>
                  <span><strong>Type:</strong> {fb.senderType}</span>
                  {fb.senderType === 'customer'
                    ? <span><strong>Customer ID:</strong> {fb.customerId}</span>
                    : <span><strong>Staff ID:</strong> {fb.staffId}</span>}
                  <span><strong>Date:</strong> {new Date(fb.createdAt).toLocaleString()}</span>
                </div>
                <p className={styles.messageBody}>{fb.message}</p>
                <div className={styles.actions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(fb._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {filteredFeedbacks.length === 0 && (
              <div className={styles.message}>No feedbacks found.</div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
