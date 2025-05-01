import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Invoices/invoiceDetails.module.css";
import { getCustomerById } from "../../api/customers";
import { getOrderById } from "../../api/orders";
import { formatDate } from "../../utils/validators";
import { approveInvoice, deleteInvoice, getInvoiceById, payInvoice } from "../../api/invoice";
import { toast } from 'react-hot-toast';


const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const inv = await getInvoiceById(id);
      setInvoice(inv);
  
      const cust = await getCustomerById(inv.customerId);
      setCustomer(cust);
  
      const fetchedOrders = await Promise.all(
        inv.orders.map((oid) => getOrderById(oid))
      );
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const doApprove = async () => {
    setApproving(true);
    try {
      await approveInvoice(id);
      fetchData();
      
    } catch (err) {
      toast.error("Approve failed: " + err);
    } finally {
      setApproving(false);
    }
  };

  const doPay = async () => {
    setMarking(true);
    try {
      await payInvoice(id, "paid");
      setInvoice((inv) => ({
        ...inv,
        status: "paid"
      }));
    } catch (err) {
      toast.error("Payment update failed: " + err);
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteInvoice(id);
      navigate("/invoices");
    } catch(err) {
      toast.error("Error: ", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/invoices")}>Back</button>

      <div className={styles.invoiceCard}>
        {error ? (
          <p className={styles.error}>Error: {error}</p>
        ) : loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : invoice ? (
          <>
            <header className={styles.header}>
              <h1>Invoice</h1>
              <div className={styles.btnGroup}>
                {invoice.draft && (
                  <button onClick={doApprove} disabled={approving} className={styles.approve}>
                    {`${approving ? "Approving..." : "Approve"}`}
                  </button>
                )}
                {invoice.method && (
                  <button onClick={doPay} disabled={marking} className={styles.pay}>
                    {`${marking ? "Marking..." : "Mark Paid"}`}
                  </button>
                )}
                <button onClick={() => window.print()} className={styles.print}>
                  Print
                </button>
                <button  onClick={handleDelete} className={styles.deleteBtn} disabled={deleting}>
                  {`${deleting ? "Deleting..." : "Delete"}`}
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
              <p><strong>ID:</strong> {invoice._id}</p>
              <p><strong>Created:</strong> {formatDate(invoice.createdAt)}</p>
              <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
              <p><strong>Status:</strong> {invoice.status}</p>
              <p><strong>Amount:</strong> ₹{invoice.amount.toFixed(2)}</p>
            </section>
            {orders.length > 0 && (
              <section className={styles.section}>
                <h2>Orders</h2>
                <table className={styles.orderTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product Name</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order =>
                      order.orderProducts.map((o) => (
                        <tr key={o._id}>
                          <td>{o._id}</td>
                          <td>{o.inventoryId.productName}</td>
                          <td>{o.quantity}</td>
                          <td>₹{o.price.toFixed(2)}</td>
                          <td>₹{(o.price * o.quantity).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </section>
            )}
          </>) : (
          <p className={styles.loading}>No Details found.</p>
        )}
      </div>
    </div >
  );
};

export default InvoiceDetails;
