import React, { useEffect, useState } from 'react';
import styles from '../../styles/PageStyles/Feedbacks/feedbacks.module.css';
import { useNavigate } from 'react-router-dom';
import { getAllFeedbacks, deleteFeedbackById } from '../../api/feedbacks';
import RefreshButton from '../../components/RefreshButton';
import SearchBar from '../../components/SearchBar';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");


    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const all = await getAllFeedbacks();
            setFeedbacks(all);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

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
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery)
    );

    if (error) return <div className={styles.error}>Error: {error}</div>;


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Feedbacks</h1>
            <div className={styles.actions}>
                <div className={styles.rightSide}>
                    <SearchBar
                        placeholder="Search keywords..."
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
                        {feedbacks.map(fb => (
                            <li key={fb._id} className={styles.card}>
                                <div className={styles.meta}>
                                    <span><strong>From:</strong> {fb.senderType}</span>
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
                        {feedbacks.length === 0 && <div className={styles.message}>No feedbacks found.</div>}
                    </ul>
                )
                }
            </div>
        </div>
    );
};

export default Feedbacks;
