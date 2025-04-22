import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import styles from "../../styles/PageStyles/Invoices/invoicesList.module.css";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("https://suims.vercel.app/api/invoices");
        if (!res.ok) throw new Error("Failed to load invoices");
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = invoices.filter(inv => {
    const q = searchQuery.toLowerCase();
    return (
      inv._id.toLowerCase().includes(q) ||
      (inv.customer || "").toLowerCase().includes(q) ||
      new Date(inv.createdAt).toLocaleDateString().toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Invoices</h1>

      {/* top action row */}
      <div className={styles.actions}>
        <Link to="/invoice/add" className={styles.generateBtn}>
          Generate Invoice
        </Link>
        <div className={styles.rightSide}>
          <SearchBar
            placeholder="Search invoices..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {error ? (
        <p className={styles.error}>Error: {error}</p>
      ) :
        loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : (
          <div className={styles.listCard}>
            {filtered.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => (
                    <tr key={inv._id}>
                      <td>{inv._id}</td>
                      <td>{inv.customer || "—"}</td>
                      <td>₹{inv.totalAmount?.toFixed(2) || "0.00"}</td>
                      <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={styles.viewBtn}
                          onClick={() => navigate(`/invoice/view/${inv._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noInvoices}>No invoices found.</p>
            )}
          </div>
        )}
    </div>
  );
};

export default InvoiceList;
