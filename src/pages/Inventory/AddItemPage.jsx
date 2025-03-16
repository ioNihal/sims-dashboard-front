import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/addItemPage.module.css";

const AddItemPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productDetails, setProductDetails] = useState({ category: "", price: "" });
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("inventoryItems")) || []
  );

  // Retrieve suppliers (with product data) from localStorage on component mount.
  useEffect(() => {
    const suppliersData = JSON.parse(localStorage.getItem("suppliers")) || [];
    setSuppliers(suppliersData);
  }, []);

  // When a supplier is selected, update the products dropdown.
  useEffect(() => {
    if (selectedSupplierId) {
      const supplier = suppliers.find(
        (s) => s.id === parseInt(selectedSupplierId, 10)
      );
      if (supplier && supplier.products) {
        setProducts(supplier.products);
      } else {
        setProducts([]);
      }
      // Reset product selection and auto-filled details.
      setSelectedProduct("");
      setProductDetails({ category: "", price: "" });
    }
  }, [selectedSupplierId, suppliers]);

  // When a product is selected, auto-fill its category and price.
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.name === selectedProduct);
      if (product) {
        setProductDetails({ category: product.category, price: product.price });
      }
    } else {
      setProductDetails({ category: "", price: "" });
    }
  }, [selectedProduct, products]);

  const updateLocalStorage = (updatedItems) => {
    localStorage.setItem("inventoryItems", JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const handleSubmit = () => {
    if (!selectedSupplierId || !selectedProduct || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }

    const supplier = suppliers.find(
      (s) => s.id === parseInt(selectedSupplierId, 10)
    );
    const newQty = parseInt(quantity, 10);
    const supplierName = supplier ? supplier.name : "";

    // Check if the item already exists based on supplier and product name.
    const existingIndex = items.findIndex(
      (item) => item.supplier === supplierName && item.name === selectedProduct
    );

    if (existingIndex !== -1) {
      // If exists, update the quantity.
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += newQty;
      updateLocalStorage(updatedItems);
    } else {
      // Otherwise, add as a new item.
      const newItem = {
        id: Date.now(),
        supplier: supplierName,
        name: selectedProduct,
        category: productDetails.category,
        priceperunit: productDetails.price,
        quantity: newQty,
      };
      const updatedItems = [...items, newItem];
      updateLocalStorage(updatedItems);
    }

    // Reset form fields after submission.
    setSelectedSupplierId("");
    setProducts([]);
    setSelectedProduct("");
    setProductDetails({ category: "", price: "" });
    setQuantity("");
    alert("Item added successfully!");
  };

  const handleCancel = () => {
    // Reset all fields.
    setSelectedSupplierId("");
    setProducts([]);
    setSelectedProduct("");
    setProductDetails({ category: "", price: "" });
    setQuantity("");
  };

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Back
      </button>
      <h3>Add New Item</h3>
      <div className={styles.formGroup}>
        <label>Supplier</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      {selectedSupplierId && (
        <div className={styles.formGroup}>
          <label>Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((product, index) => (
              <option key={index} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedProduct && (
        <>
          <div className={styles.formGroup}>
            <label>Category</label>
            <input type="text" value={productDetails.category} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Price per Unit</label>
            <input type="number" value={productDetails.price} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </>
      )}
      <div className={styles.buttonGroup}>
        <button onClick={handleSubmit} className={styles.saveBtn}>
          Save
        </button>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddItemPage;
