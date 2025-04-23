import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import styles from "../../styles/PageStyles/Invoices/invoices.module.css";
import RefreshButton from "../../components/RefreshButton";

const Invoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchInvoices = async () => {
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

  useEffect(() => {
    fetchInvoices();
  }, []);

  // apply search + status filter
  const filtered = invoices
    .filter(inv => {
      // search by id, customer name, or date
      const q = searchQuery.toLowerCase();
      return (
        inv._id.toLowerCase().includes(q) ||
        (inv.customer || "").toLowerCase().includes(q) ||
        new Date(inv.createdAt).toLocaleDateString().toLowerCase().includes(q)
      );
    })
    .filter(inv => {
      if (statusFilter === "all") return true;
      return inv.status === statusFilter;
    });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Invoices</h1>

      {/* top action row: only search + status filter */}
      <div className={styles.actions}>
        <div className={styles.selectionForm}>
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className={styles.rightSide}>
          <RefreshButton onClick={fetchInvoices} loading={loading} />
          <SearchBar
            placeholder="Search invoices..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {error ? (
        <p className={styles.error}>Error: {error}</p>
      ) : loading ? (
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
                  <th>Status</th>
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
                    <td className={styles.statusCell}>{inv.status}</td>
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

export default Invoice;
