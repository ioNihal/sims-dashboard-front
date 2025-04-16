// src/pages/Customers/Customers.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customers.module.css";
import SearchBar from "../../components/SearchBar";
import { capitalize } from "../../utils/validators";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/customer/");
        const data = await res.json();
        // Support both response formats: either data.customer or data as an array.
        const customerArray = data.data || data;
        
        // Map _id to id for consistency.
        const formattedCustomers = customerArray.map((cust) => ({
          ...cust,
          id: cust._id,
        }));
        setCustomers(formattedCustomers);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://suims.vercel.app/api/customer/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete customer");
      }
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
        {/* Navigate to the dynamic add customer page */}
        <button className={styles.addBtn} onClick={() => navigate("/customers/add")}>
          Add Customer
        </button>
        <SearchBar placeholder="Search customers..." searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
                <th>ID</th>
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
                  <td>{`CU${customer.id.substring(5,10).toUpperCase()}`}</td>
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
