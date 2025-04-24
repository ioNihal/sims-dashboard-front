// src/pages/Invoices/Invoices.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import RefreshButton from "../../components/RefreshButton";
import { getAllCustomers, getCustomerById } from "../../api/customers";
import styles from "../../styles/PageStyles/Invoices/invoices.module.css";
import { capitalize, formatDate } from "../../utils/validators";

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── 1) FETCH INVOICES ──────────────────────────────────────
  const fetchInvoices = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://suims.vercel.app/api/invoice");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to load invoices");
      }

      const populated = await Promise.all(
        data.invoice.map(async inv => {
          const cust = await getCustomerById(inv.customerId);
          return { ...inv, customer: cust.name };
        }))
      setInvoices(Array.isArray(populated) ? populated : []);
    } catch (err) {
      setError(err.message);                           // ◀ set error state
    } finally {
      setLoading(false);
    }
  };

 
  const fetchCustomers = async () => {
    try {
      const fetched = await getAllCustomers();
      setCustomers(fetched || []);
    } catch (err) {
      console.error("Could not load customers:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);


  const handleGenerate = async () => {
    if (!customers.length) return;
    if (
      !window.confirm(`Generate invoices now for ${customers.length} customers?`)
    )
      return;

    setGenLoading(true);
    try {
      const ids = customers.map((c) => c._id);
      const res = await fetch(
        "https://suims.vercel.app/api/invoice/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customers: ids }),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message || "Generation failed");

      await fetchInvoices();
      alert("Invoices generated successfully");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setGenLoading(false);
    }
  };

  
  const filtered = invoices
    .filter((inv) => {
      const q = searchQuery.toLowerCase();
      return (
        inv._id.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        formatDate(inv.createdAt, false).toLowerCase().includes(q)
      );
    })
    .filter((inv) =>
      statusFilter === "all" ? true : inv.status === statusFilter
    );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Invoices</h1>

      <div className={styles.actions}>
        <button
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={genLoading}
        >
          {genLoading ? "Generating…" : "Generate Invoices"}
        </button>

        <div className={styles.selectionForm}>
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="pending">Unpaid</option>
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
                {filtered.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv._id}</td>
                    <td>{inv.customer}</td>
                    <td>₹{inv.amount.toFixed(2)}</td>
                    <td>
                      {formatDate(inv.createdAt, false)}
                    </td>
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

export default Invoices;
