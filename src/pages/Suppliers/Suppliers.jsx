
import React, { useState, useEffect, useMemo } from "react";
import styles from "../../styles/PageStyles/Suppliers/suppliers.module.css";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";
import { capitalize } from "../../utils/validators";
import RefreshButton from "../../components/RefreshButton";
import { getSuppliers, deleteSupplier } from "../../api/suppliers";
import { toast } from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const supplierArray = await getSuppliers();
      const formatted = (supplierArray || []).map(s => ({ ...s, id: s._id }));
      setSuppliers(formatted);
    } catch (err) {
      toast.error(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  
  const filteredSuppliers = useMemo(() => {
    return (suppliers || []).filter(s => {
      const q = searchQuery.toLowerCase();
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q) ||
        (s.phone || "").includes(q)
      );
    });
  }, [suppliers, searchQuery]);

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

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : (
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
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map(s => (
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
                     
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noResults}>
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
