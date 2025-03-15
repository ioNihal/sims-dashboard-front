import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Suppliers/supplierDetail.module.css";

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    if (savedSuppliers) {
      const suppliers = JSON.parse(savedSuppliers);
      const foundSupplier = suppliers.find(
        (supplier) => supplier.id.toString() === id
      );
      if (foundSupplier) {
        setSupplier(foundSupplier);
      } else {
        alert("Supplier not found!");
        navigate("/suppliers");
      }
    }
  }, [id, navigate]);

  if (!supplier) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading supplier details...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/suppliers")}>
        Back
      </button>
      <div className={styles.card}>
        <h2 className={styles.title}>{supplier.name}</h2>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email:</span>
            <span>{supplier.email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone:</span>
            <span>{supplier.phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Address:</span>
            <span>{supplier.address}</span>
          </div>
        </div>
        <div className={styles.products}>
          <h3 className={styles.productsTitle}>Products</h3>
          {supplier.products && supplier.products.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price per Item</th>
                </tr>
              </thead>
              <tbody>
                {supplier.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noProducts}>No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
