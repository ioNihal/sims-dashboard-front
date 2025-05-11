
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import RefreshButton from "../../components/RefreshButton";
import { getAllCustomers } from "../../api/customers";
import styles from "../../styles/PageStyles/Invoices/invoices.module.css";
import { formatDate } from "../../utils/validators";
import { generateInvoices, getAllInvoices } from "../../api/invoice";
import { toast } from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Unpaid" },
  { value: "paid", label: "Paid" },
];

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch both customers and invoices in one go
  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedCustomers = await getAllCustomers();
      setCustomers(fetchedCustomers || []);

      const data = await getAllInvoices();
      if (data && data.length) {
        // build map of id -> name
        const custMap = (fetchedCustomers || []).reduce((map, c) => {
          map[c._id] = c.name;
          return map;
        }, {});

        const populated = data.map(inv => ({
          ...inv,
          customer: custMap[inv.customerId] ?? "Deleted customer"
        }));
        populated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInvoices(populated);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!customers.length) return;
    setGenLoading(true);
    try {
      const ids = customers.map(c => c._id);
      await generateInvoices(ids);
      await fetchData();
      toast.success("Invoices generated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return invoices
      .filter(inv => {
        const q = searchQuery.toLowerCase();
        return (
          inv._id.toLowerCase().includes(q) ||
          inv.customer.toLowerCase().includes(q) ||
          formatDate(inv.createdAt, false).toLowerCase().includes(q)
        );
      })
      .filter(inv => (statusFilter === "all" ? true : inv.status === statusFilter));
  }, [invoices, searchQuery, statusFilter]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Invoices</h1>

      <div className={styles.actions}>
        <button
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={genLoading}
        >
          {genLoading ? "Generating Invoices…" : "Generate Invoices"}
        </button>

        <div className={styles.selectionForm}>
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.rightSide}>
          <RefreshButton onClick={fetchData} loading={loading} />
          <SearchBar
            placeholder="Search invoices..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      <div className={styles.listCard}>
        {loading ? (
          <div className={styles.loading}>
             <div className={styles.spinner} />
          </div>
        ) : filtered.length > 0 ? (
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
                  <td>{inv.customer}</td>
                  <td>₹{inv.amount.toFixed(2)}</td>
                  <td>{formatDate(inv.createdAt, false)}</td>
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
    </div>
  );
};

export default Invoices;
