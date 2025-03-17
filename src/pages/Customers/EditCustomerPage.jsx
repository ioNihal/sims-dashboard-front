import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/editCustomerPage.module.css";

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updatedCustomer, setUpdatedCustomer] = useState(null);

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      const customers = JSON.parse(savedCustomers);
      const customer = customers.find(
        (cust) => String(cust.id) === id
      );
      if (customer) {
        setUpdatedCustomer(customer);
      } else {
        alert("Customer not found");
        navigate("/customers");
      }
    } else {
      alert("No customers available");
      navigate("/customers");
    }
  }, [id, navigate]);

  if (!updatedCustomer) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleChange = (e) => {
    setUpdatedCustomer({ ...updatedCustomer, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !updatedCustomer.name ||
      !updatedCustomer.email ||
      !updatedCustomer.phone ||
      !updatedCustomer.address
    ) {
      alert("Fields cannot be empty!");
      return;
    }
    const savedCustomers = localStorage.getItem("customers");
    let customers = savedCustomers ? JSON.parse(savedCustomers) : [];
    customers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    localStorage.setItem("customers", JSON.stringify(customers));
    navigate("/customers");
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className={styles.container}>
      <h1>Edit Customer</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedCustomer.name}
            onChange={handleChange}
            placeholder="Enter customer name"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={updatedCustomer.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={updatedCustomer.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={updatedCustomer.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={updatedCustomer.password}
            onChange={handleChange}
            placeholder="Update password"
          />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPage;
