// pages/Customers.js
import React, { useState, useEffect } from "react";
import styles from "../styles/PageStyles/Customers/customers.module.css";
import SearchBar from "../components/SearchBar";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleCustomers = [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", status: "Active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", status: "Inactive" },
      { id: 3, name: "Alice Brown", email: "alice@example.com", phone: "555-678-1234", status: "Active" },
    ];

    setTimeout(() => {
      setCustomers(sampleCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      <h1>Customers</h1>

      <div className={styles.actions}>
        <button className={styles.addBtn}>Add Customer</button>
        <SearchBar
          placeholder="Search customers..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => handleEdit(customer.id)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(customer.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default Customers;
