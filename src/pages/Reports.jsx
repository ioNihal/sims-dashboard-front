// pages/Reports.js
import React from 'react';
import styles from '../styles/PageStyles/page.module.css'

const Reports = () => {
  return (
    <div className={styles.page}>
      <h1>Reports</h1>
      <p>This page displays various analytical reports on inventory, sales, and orders.</p>
      {/* Example: List of reports */}
      <ul>
        <li>Sales Report - Q1 2025</li>
        <li>Inventory Turnover Report</li>
        <li>Order Fulfillment Report</li>
      </ul>
    </div>
  );
};

export default Reports;
