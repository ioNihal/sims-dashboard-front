// src/pages/Suppliers/SupplierDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../styles/PageStyles/Suppliers/supplierDetail.module.css";
import { capitalize, formatDate } from "../../utils/validators";
import { deleteSupplier, getSupplier } from "../../api/suppliers";
import { toast } from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadSupplier = async () => {
      setLoading(true);
      try {
        const data = await getSupplier(id);
        if (!data) {
          toast.error("Supplier not found");
          return navigate("/suppliers");
        }
        setSupplier({ id: data._id, ...data });
      } catch (err) {
        toast.error(err.message || "Failed to load supplier");
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
        <p className={styles.loading}>
          <div className={styles.skeleton} style={{ width: '60%' }} />
          <div className={styles.skeleton} style={{ width: '40%' }} />
          <div className={styles.skeleton} style={{ width: '80%' }} />
        </p>
      </div>
    );
  }

  const handleDeleteSupplier = async (id) => {


    try {
      setDeleting(true);
      await deleteSupplier(id);
      toast.success("Supplier deleted");
      navigate("/suppliers")
    } catch (err) {
      toast.error(err.message || "Failed to delete supplier");
    } finally {
      setDeleting(false);
    }
  };

  if (!supplier) return null;

  const {
    name = "—",
    email = "—",
    phone = "—",
    address = "—",
    createdAt,
    updatedAt,
    products = []
  } = supplier;

  return (
    <div className={styles.page}>
      <div className={styles.btnGroup}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/suppliers")}
        >
          Back
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => setShowConfirm(true)}
          disabled={deleting}
        >
          {`${deleting ? "Deleting…" : "Delete"}`}
        </button>
        {showConfirm && (
          <ConfirmDialog
            message="Sure you want to delete??"
            onConfirm={() => {
              setShowConfirm(false);
              handleDeleteSupplier(id);
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>

      <div className={styles.card}>
        <h4 className={styles.title}>Supplier Details</h4>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name:</span>
            <span>{capitalize(name)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email:</span>
            <span>{email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone:</span>
            <span>{phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Address:</span>
            <span>{address}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Created At:</span>
            <span className={styles.date}>{formatDate(createdAt)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Updated At:</span>
            <span className={styles.date}>{formatDate(updatedAt)}</span>
          </div>
        </div>

        <div className={styles.products}>
          <h3 className={styles.productsTitle}>Products</h3>
          {products.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{capitalize(p.name)}</td>
                    <td>{capitalize(p.category)}</td>
                    <td>₹{p.pricePerItem?.toFixed(2) ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noProducts}>No products available.</p>
          )}
        </div>
      </div>
    </div >
  );
};

export default SupplierDetail;
