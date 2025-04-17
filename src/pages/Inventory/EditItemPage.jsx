// src/pages/Inventory/EditItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/editItemPage.module.css";
import { validateQuantity } from "../../utils/validators";

const EditItemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Local state for item data and form handling
  const [updatedItem, setUpdatedItem] = useState({
    productName: "",
    category: "",
    supplierName: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ quantity: "" });
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing inventory item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(
          `https://suims.vercel.app/api/inventory/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch inventory item");
        const json = await res.json();
        const item = json.inventory;
        setUpdatedItem({
          productName: item.productName || "",
          category: item.category || "",
          supplierName: item.supplierName || "",
          quantity: item.quantity?.toString() || "",
        });
      } catch (err) {
        console.error("Error fetching item:", err);
        setSubmitError("Error fetching item. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Live validation on quantity change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem((prev) => ({ ...prev, [name]: value }));
    if (name === "quantity") {
      const errorMsg = validateQuantity(value);
      setErrors({ quantity: errorMsg });
    }
  };

  // Validate before submitting
  const validateFields = () => {
    const quantityError = validateQuantity(updatedItem.quantity);
    setErrors({ quantity: quantityError });
    return !quantityError;
  };

  // Submit update via PATCH
  const handleSubmit = async () => {
    setSubmitError("");
    if (!validateFields()) return;
    setIsSaving(true);

    try {
      const res = await fetch(
        `https://suims.vercel.app/api/inventory/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: updatedItem.quantity }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.message || "Failed to update inventory");
        setIsSaving(false);
        return;
      }
      navigate("/inventory");
    } catch (err) {
      console.error("Error updating inventory:", err);
      setSubmitError("Error updating inventory. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/inventory");

  if (loading) return <div className={styles.page}><p className={styles.loading}>Loading Product Details...</p></div>;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={handleCancel}>
        Back
      </button>
      <h3>Edit Inventory Item</h3>

      {submitError && <p className={styles.error}>{submitError}</p>}

      <div className={styles.inputWrapper}>
        <label>Product Name</label>
        <input type="text" value={updatedItem.productName} disabled />
      </div>

      <div className={styles.inputWrapper}>
        <label>Category</label>
        <input type="text" value={updatedItem.category} disabled />
      </div>

      <div className={styles.inputWrapper}>
        <label>Supplier</label>
        <input type="text" value={updatedItem.supplierName} disabled />
      </div>

      <div className={styles.inputWrapper}>
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={updatedItem.quantity}
          onChange={handleChange}
        />
        {errors.quantity && (
          <p className={styles.error}>{errors.quantity}</p>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={handleSubmit}
          className={styles.saveBtn}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditItemPage;
