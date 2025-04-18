// src/pages/Inventory/EditItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/editItemPage.module.css";
import { validateQuantity, validateThreshold } from "../../utils/validators";


const EditItemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updatedItem, setUpdatedItem] = useState({
    productName: "",
    category: "",
    supplierName: "",
    unitPrice: "",
    quantity: "",
    threshold: "",
  });
  const [loading, setLoading] = useState(true);


  const [errors, setErrors] = useState({
    quantity: "",
    threshold: "",
  });
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
        const { inventory: item } = await res.json();

        setUpdatedItem({
          productName: item.productName || "",
          category: item.category || "",
          supplierName: item.supplierName || "",
          unitPrice: item.productPrice?.toString() || "",
          quantity: item.quantity?.toString() || "",
          threshold: item.threshold?.toString() || "",
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

  // Live validation on quantity or threshold change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem((prev) => ({ ...prev, [name]: value }));

    if (name === "quantity") {
      setErrors((e) => ({ ...e, quantity: validateQuantity(value) }));
    }
    if (name === "threshold") {
      setErrors((e) => ({ ...e, threshold: validateThreshold(value) }));
    }
  };

  // Validate before submitting
  const validateFields = () => {
    const quantityError = validateQuantity(updatedItem.quantity);
    const thresholdError = validateThreshold(updatedItem.threshold);
    setErrors({ quantity: quantityError, threshold: thresholdError });
    return !quantityError && !thresholdError;
  };


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
          body: JSON.stringify({
            quantity: parseInt(updatedItem.quantity, 10),
            threshold: parseInt(updatedItem.threshold, 10),
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update inventory");
      }
      navigate("/inventory");
    } catch (err) {
      console.error("Error updating inventory:", err);
      setSubmitError(err.message || "Error updating inventory. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/inventory");

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading Product Details...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={handleCancel}>
        Back
      </button>
      <h3>Edit Inventory Item</h3>
      {submitError && <p className={styles.error}>{submitError}</p>}
      <div className={styles.formGroup}>

        <div className={styles.inputWrapper}>
          <label>Product Name</label>
          <input type="text" value={updatedItem.productName} disabled />
        </div>

        <div className={styles.inputWrapper}>
          <label>Category</label>
          <input type="text" value={updatedItem.category} disabled />
        </div>

        <div className={styles.inputWrapper}>
          <label>Unit Price</label>
          <input type="text" value={updatedItem.unitPrice} disabled />
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

        <div className={styles.inputWrapper}>
          <label>Low Stock Threshold</label>
          <input
            type="number"
            name="threshold"
            value={updatedItem.threshold}
            onChange={handleChange}
          />
          {errors.threshold && (
            <p className={styles.error}>{errors.threshold}</p>
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
    </div>
  );
};

export default EditItemPage;
