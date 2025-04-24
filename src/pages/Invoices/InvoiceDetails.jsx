import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Invoices/invoiceDetails.module.css";
import { getCustomerById } from "../../api/customers";
import { getOrderById } from "../../api/orders";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // 1) fetch invoice
      const resInv = await fetch(`https://suims.vercel.app/api/invoice/${id}`);
      const bodyInv = await resInv.json();
      if (!resInv.ok) throw new Error(bodyInv.message || "Could not load invoice");
      const inv = bodyInv.invoice;
      setInvoice(inv);

      // 2) fetch customer
      const cust = await getCustomerById(inv.customerId);
      setCustomer(cust);

      // 3) fetch each order by ID
      const fetchedOrders = await Promise.all(
        inv.orders.map((oid) =>
          getOrderById(oid)
        )
      );
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const doApprove = async () => {
    setActionLoading(true);
    try {
      await fetch(`https://suims.vercel.app/api/invoice/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: false }),
      });
      setInvoice((inv) => ({ ...inv, draft: false }));
    } catch (err) {
      alert("Approve failed: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const doPay = async () => {
    const txn = prompt("Enter UPI transaction ID");
    if (!txn) return;
    setActionLoading(true);
    try {
      await fetch(`https://suims.vercel.app/api/invoice/${id}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txn,
          method: "upi",
          transactionDate: new Date().toISOString(),
        }),
      });
      setInvoice((inv) => ({ ...inv, status: "paid", method: "upi", transactionId: txn, transactionDate: new Date().toISOString() }));
    } catch (err) {
      alert("Payment update failed: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  const { _id, status, amount, dueDate, createdAt, draft } = invoice;

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/invoices")}>Back</button>

      <div className={styles.invoiceCard}>
        <header className={styles.header}>
          <h1>Invoice</h1>
          <div className={styles.btnGroup}>
            {draft && (
              <button onClick={doApprove} disabled={actionLoading} className={styles.approve}>
                Approve
              </button>
            )}
            {!draft && status === "pending" && (
              <button onClick={doPay} disabled={actionLoading} className={styles.pay}>
                Mark Paid
              </button>
            )}
            <button onClick={() => window.print()} className={styles.print}>
              Print
            </button>
          </div>
        </header>

        <section className={styles.section}>
          <h2>Customer</h2>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
        </section>

        <section className={styles.section}>
          <h2>Invoice Details</h2>
          <p><strong>ID:</strong> {_id}</p>
          <p><strong>Created:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <p><strong>Due:</strong> {new Date(dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Amount:</strong> ₹{amount.toFixed(2)}</p>
        </section>

        {orders.length > 0 && (
          <section className={styles.section}>
            <h2>Orders</h2>
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders[0].orderProducts.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id}</td>
                    <td>{o.quantity}</td>
                    <td>₹{o.price.toFixed(2)}</td>
                    <td>₹{(o.price * o.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
