// pages/Orders.js
import React from 'react';
import styles from '../styles/PageStyles/page.module.css'

const Orders = () => {
  return (
    <div className={styles.page}>
      <h1>Orders</h1>
      <p>This page shows order details, including statuses and payment info.</p>
      {/* Example: Table of orders */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#001</td>
            <td>Customer 1</td>
            <td>Approved</td>
            <td>$150.00</td>
          </tr>
          <tr>
            <td>#002</td>
            <td>Customer 2</td>
            <td>Pending</td>
            <td>$200.00</td>
          </tr>
          <tr>
            <td>#003</td>
            <td>Customer 3</td>
            <td>Rejected</td>
            <td>$120.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
