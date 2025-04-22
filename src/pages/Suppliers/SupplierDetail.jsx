import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Suppliers/supplierDetail.module.css";
import { capitalize, formatDate } from "../../utils/validators";

import { getSupplier } from "../../api/suppliers";

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        const data = await getSupplier(id);
        data.id = data._id;
        setSupplier(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate("/suppliers");
      } finally {
        setLoading(false);
      }
    };
    loadSupplier();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading supplier details…</p>
      </div>
    );
  }

  if (!supplier) return null;

  return (
    <div className={styles.page}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/suppliers")}
      >
        Back
      </button>

      <div className={styles.card}>
        <h4 className={styles.title}>Supplier Details</h4>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name:</span>
            <span>{capitalize(supplier.name)}</span>
          </div>
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
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Created At:</span>
            <span className={styles.date}>
              {formatDate(supplier.createdAt)}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Updated At:</span>
            <span className={styles.date}>
              {formatDate(supplier.updatedAt)}
            </span>
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
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {supplier.products.map((p) => (
                  <tr key={p._id}>
                    <td>{capitalize(p.name)}</td>
                    <td>{capitalize(p.category)}</td>
                    <td>₹{p.pricePerItem}</td>
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
