// src/pages/Customers/Customers.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customers.module.css";
import SearchBar from "../../components/SearchBar";
import { capitalize } from "../../utils/validators";
import RefreshButton from "../../components/RefreshButton";
import { deleteCustomer, getAllCustomers } from "../../api/customers";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const all = await getAllCustomers();
      setCustomers(all || []);
    } catch (err) {
      toast.error(err.message || "Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
   
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success("Customer deleted");
    } catch (err) {
      toast.error(err || "Error deleting customer");
    }
  };

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (customers || []).filter(c => {
      return (
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.address || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q)
      );
    });
  }, [customers, searchQuery]);

  return (
    <div className={styles.page}>
      <h1>Customers</h1>
      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={() => navigate("/customers/add")}>
          Add Customer
        </button>
        <div className={styles.rightSide}>
          <RefreshButton onClick={fetchCustomers} loading={loading} />
          <SearchBar
            placeholder="Search customers..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <p className={styles.loading}>Loading Customers...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                <tr key={c.id}>
                  <td>{capitalize(c.name)}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{capitalize(c.address)}</td>
                  <td>
                    <button className={styles.viewBtn} onClick={() => navigate(`/customers/view/${c.id}`)}>View</button>
                    <button className={styles.editBtn} onClick={() => navigate(`/customers/edit/${c.id}`)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)}>Delete</button>
                    {showConfirm && (
                      <ConfirmDialog
                        message="Sure you want to delete??"
                        onConfirm={() => {
                          setShowConfirm(false);
                          handleDeleteCustomer(c.id);
                        }}
                        onCancel={() => setShowConfirm(false)}
                      />
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className={styles.noResults}>No customers found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Customers;
