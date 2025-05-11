
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Invoices/invoiceDetails.module.css";
import { getCustomerById } from "../../api/customers";
import { getOrderById } from "../../api/orders";
import { capitalize, formatDate } from "../../utils/validators";
import {
  approveInvoice,
  deleteInvoice,
  getInvoiceById,
  payInvoice,
} from "../../api/invoice";
import { toast } from "react-hot-toast";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState({ name: "Loading…", email: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const inv = await getInvoiceById(id);
      setInvoice(inv);

      // fetch customer, fallback if deleted
      const cust = await getCustomerById(inv.customerId);
      setCustomer(
        cust ?? { name: "Deleted customer", email: "-", phone: "-" }
      );

      // fetch each order
      const fetchedOrders = await Promise.all(
        inv.orders.map((oid) => getOrderById(oid).catch(() => null))
      );
      setOrders(fetchedOrders.filter(Boolean));
    } catch (err) {
      toast.error("Failed to load invoice: " + err.message);
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
      await fetchData();
      toast.success("Invoice approved");
    } catch (err) {
      toast.error("Approve failed: " + err.message);
    } finally {
      setApproving(false);
    }
  };

  const doPay = async () => {
    setMarking(true);
    try {
      await payInvoice(id, "paid");
      setInvoice((inv) => ({ ...inv, status: "paid" }));
      toast.success("Marked as paid");
    } catch (err) {
      toast.error("Payment update failed: " + err.message);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className={styles.page}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/invoices")}
      >
        Back
      </button>

      <div className={styles.invoiceCard}>
        {loading || !invoice ? (
          <div className={styles.loading}>
            <div className={styles.skeleton} style={{ width: '60%' }} />
            <div className={styles.skeleton} style={{ width: '40%' }} />
            <div className={styles.skeleton} style={{ width: '80%' }} />
          </div>
        ) : (
          <>
            <header className={styles.header}>
              <h1>Invoice</h1>
              <div className={styles.btnGroup}>
                {invoice.draft && (
                  <button
                    onClick={doApprove}
                    disabled={approving}
                    className={styles.approve}
                  >
                    {approving ? "Approving..." : "Approve"}
                  </button>
                )}
                {invoice.method && invoice.status === "pending" && (
                  <button
                    onClick={doPay}
                    disabled={marking}
                    className={styles.pay}
                  >
                    {marking ? "Marking..." : "Mark Paid"}
                  </button>
                )}
    
              </div>
            </header>

            <section className={styles.section}>

              <h2>Customer</h2>
              <p>
                <strong>Name:</strong> {customer.name}
              </p>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              <hr />
              <p>
                <strong>Method:</strong> {invoice.method || "N/A"}
              </p>
              <p>
                <strong>Transaction ID:</strong> {invoice.transactionId || "N/A"}
              </p>
              <p>
                <strong>Transaction Date:</strong> {`${invoice.transactionDate && formatDate(invoice.transactionDate, false)}` || "N/A"}
              </p>
            </section>

            <section className={styles.section}>
              <h2>Invoice Details</h2>
              <p>
                <strong>ID:</strong> {invoice._id}
              </p>
              <p>
                <strong>Created:</strong> {formatDate(invoice.createdAt)}
              </p>
              <p>
                <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
              </p>
              <p>
                <strong>Status:</strong> {invoice.status}
              </p>
              <p>
                <strong>Amount:</strong> ₹{invoice.amount.toFixed(2)}
              </p>

            </section>

            {orders.length > 0 ? (
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
                    {orders.map((order) =>
                      order.orderProducts.map((o) => (
                        <tr key={o._id}>
                          <td><Link to={`/orders/${o._id}`}>#{o._id}</Link></td>
                          <td>{capitalize(o.name) || "Deleted product"}</td>
                          <td>{o.quantity || "N/A"}</td>
                          <td>₹{o.price.toFixed(2) || "N/A"}</td>
                          <td>₹{(o.price * o.quantity).toFixed(2) || "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </section>
            ) : (
              <section className={styles.section}>
                <p>No orders found</p>
              </section>

            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
