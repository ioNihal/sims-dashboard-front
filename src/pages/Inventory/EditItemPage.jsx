// src/pages/Inventory/EditItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/editItemPage.module.css";
import { validateQuantity, validateThreshold } from "../../utils/validators";
import { getInventoryItemById, updateInventoryItem } from "../../api/inventory";
import toast from "react-hot-toast";


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
        const item = await getInventoryItemById(id);
        setUpdatedItem({
          productName: item.productName || "",
          category: item.category || "",
          supplierName: item.supplierName || "",
          unitPrice: item.productPrice?.toString() || "",
          quantity: item.quantity?.toString() || "",
          threshold: item.threshold?.toString() || "",
        });
      } catch (err) {
        toast.error(err.message);
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
      await updateInventoryItem(id, {
        quantity: parseInt(updatedItem.quantity, 10),
        threshold: parseInt(updatedItem.threshold, 10),
      });
      toast.success("Inventory item updated successfully!")
      navigate("/inventory");
    } catch (err) {
      toast.error(err.message);
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/inventory");

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

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={handleCancel}>
        Back
      </button>
      <h3>Edit Inventory Item</h3>
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
