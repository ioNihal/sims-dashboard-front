// pages/Customers.js
import React from 'react';
import styles from '../styles/PageStyles/page.module.css'

const Customers = () => {
  return (
    <div className={styles.page}>
      <h1>Customers</h1>
      <p>This page displays the customer list and their details.</p>
      {/* Example: List of customers */}
      <ul>
        <li>Customer 1 - Email: customer1@example.com</li>
        <li>Customer 2 - Email: customer2@example.com</li>
        <li>Customer 3 - Email: customer3@example.com</li>
      </ul>
    </div>
  );
};

export default Customers;
