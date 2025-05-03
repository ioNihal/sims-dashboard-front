// src/components/ConfirmDialog.jsx
import React from 'react';
import styles from '../styles/ComponentStyles/ConfirmDialog.module.css';

export default function ConfirmDialog({  
  message,    // string to show  
  onConfirm,  // fn to call when user clicks “Yes”  
  onCancel    // fn to call when user clicks “No”  
}) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.yes} onClick={onConfirm}>Yes</button>
          <button className={styles.no}  onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}