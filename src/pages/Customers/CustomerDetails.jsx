// src/pages/Customers/CustomerDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customerDetails.module.css";
import { capitalize, formatDate } from "../../utils/validators";
import { deleteCustomer, getCustomerById } from "../../api/customers";
import { getAllOrders } from "../../api/orders";
import { generateInvoices } from "../../api/invoice";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [custRes, ordRes] = await Promise.allSettled([
          getCustomerById(id),
          getAllOrders()
        ]);

        if (custRes.status === "fulfilled" && custRes.value) {
          setCustomer(custRes.value);
        } else {
          toast.error(custRes.reason?.message || "Failed to load customer");
          return navigate("/customers");
        }

        if (ordRes.status === "fulfilled" && Array.isArray(ordRes.value)) {
          const custOrders = ordRes.value
            .filter(o => o.customerId?._id === id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(custOrders);
        } else {
          toast.error(ordRes.reason?.message || "Failed to load orders");
          setOrders([]);
        }
      } catch (err) {
        toast.error(err.message || "Unexpected error");
        navigate("/customers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleGenerate = async () => {
    if (!customer) return;
    setGenLoading(true);
    try {
      await generateInvoices([customer._id]);
      toast.success("Invoice generated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {

    try {
      setDeleting(true);
      await deleteCustomer(id);
      toast.success("Customer deleted");
      navigate("/customers");
    } catch (err) {
      toast.error(err.message || "Error deleting customer");
    } finally {
      setDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading customer...</div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className={styles.page}>
      <div className={styles.btnGroup}>
        <button className={styles.backButton} onClick={() => navigate("/customers")}>Back</button>
        <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)} disabled={deleting}>
          {`${deleting ? "Deleting…" : "Delete"}`}
        </button>
        {showConfirm && (
          <ConfirmDialog
            message="Sure you want to delete??"
            onConfirm={() => {
              setShowConfirm(false);
              handleDeleteCustomer(customer._id);
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
      <div className={styles.card}>
        <div className={styles.title}>Customer Details</div>
        <div className={styles.details}>
          {[
            ["Name", capitalize(customer.name)],
            ["Email", customer.email],
            ["Phone", customer.phone],
            ["Address", capitalize(customer.address)],
            ["Payment Preference", capitalize(customer.paymentPreference)],
            ["Created At", formatDate(customer.createdAt)]
          ].map(([label, value]) => (
            <div className={styles.detailItem} key={label}>
              <span className={styles.detailLabel}>{label}:</span>
              <span className={styles.detailValue}>{value || "—"}</span>
            </div>
          ))}
        </div>
        <button
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={genLoading}
        >
          {genLoading ? "Generating…" : "Generate Invoice"}
        </button>
        <div className={styles.ordersSection}>
          <h3>Recent Orders</h3>
          {orders.length > 0 ? (
            <ul className={styles.orderList}>
              {orders.map(order => (
                <li key={order._id} className={styles.orderCard}>
                  <p><strong>Order ID:</strong> <Link to={`/orders/${order._id}`}>{order._id}</Link></p>
                  <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                  <p><strong>Status:</strong> {capitalize(order.status)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noOrder}>This customer has no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
