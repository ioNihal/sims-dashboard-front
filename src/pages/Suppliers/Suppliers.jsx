import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Suppliers/suppliers.module.css";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";
import { capitalize } from "../../utils/validators";
import RefreshButton from "../../components/RefreshButton";

import { getSuppliers, deleteSupplier } from "../../api/suppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const supplierArray = await getSuppliers();
      const formatted = supplierArray.map(s => ({ ...s, id: s._id }));
      setSuppliers(formatted);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert(err.message);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      <h1>Suppliers</h1>

      <div className={styles.actions}>
        <Link to="/suppliers/add">
          <button className={styles.addBtn}>Add Supplier</button>
        </Link>

        <div className={styles.rightSide}>
          <RefreshButton onClick={fetchSuppliers} loading={loading} />
          <SearchBar
            placeholder="Search suppliers..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading suppliers...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(s => (
                <tr key={s.id}>
                  <td>{capitalize(s.name)}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.address}</td>
                  <td>
                    <Link to={`/suppliers/view/${s.id}`}>
                      <button className={styles.viewBtn}>View</button>
                    </Link>
                    <Link to={`/suppliers/edit/${s.id}`}>
                      <button className={styles.editBtn}>Edit</button>
                    </Link>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteSupplier(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.noResults}>
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
