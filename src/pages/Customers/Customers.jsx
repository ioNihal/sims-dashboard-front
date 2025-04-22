// src/pages/Customers/Customers.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customers.module.css";
import SearchBar from "../../components/SearchBar";
import { capitalize } from "../../utils/validators";
import RefreshButton from "../../components/RefreshButton";
import { deleteCustomer, getAllCustomers } from "../../api/customers";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const all = await getAllCustomers();
      setCustomers(all);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Error deleting customer");
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

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

      {loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading Customers...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/*<th>ID</th>*/}
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  {/*<td>{`CU${customer.id.substring(5,10).toUpperCase()}`}</td>*/}
                  <td>{capitalize(customer.name)}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{capitalize(customer.address)}</td>
                  <td>
                    <button className={styles.viewBtn} onClick={() => navigate(`/customers/view/${customer.id}`)}>
                      View
                    </button>
                    <button className={styles.editBtn} onClick={() => navigate(`/customers/edit/${customer.id}`)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteCustomer(customer.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.noResults}>
                    No customers found.
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

export default Customers;
