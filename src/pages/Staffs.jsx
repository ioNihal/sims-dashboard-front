// pages/Staffs.js
import React from 'react';
import styles from '../styles/PageStyles/page.module.css'

const Staffs = () => {
  return (
    <div className={styles.page}>
      <h1>Staffs</h1>
      <p>This page displays the list of staff members and their roles.</p>
      {/* Example: List of staff members */}
      <ul>
        <li>Staff 1 - Role: Manager</li>
        <li>Staff 2 - Role: Inventory Specialist</li>
        <li>Staff 3 - Role: Delivery Agent</li>
      </ul>
    </div>
  );
};

export default Staffs;
