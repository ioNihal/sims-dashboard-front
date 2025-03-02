import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Suppliers/SupplierDetails.module.css";

const SupplierDetails = () => {
    const { supplierName } = useParams();
    const navigate = useNavigate();

    console.log(supplierName)

    // Retrieve supplier details from localStorage or API
    const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
    console.log(suppliers.map((s) => s.name))
    const supplier = suppliers.find((s) => s.name === supplierName);

    if (!supplier) {
        return <p>Supplier not found.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    Back
                </button>
                <h2 className={styles.title}>{supplier.name} Details</h2>
            </div>
            <div className={styles.detailSection}>
                <p>
                    <strong>Email:</strong> {supplier.email}
                </p>
                <p>
                    <strong>Phone:</strong> {supplier.phone}
                </p>
                <p>
                    <strong>Address:</strong> {supplier.address}
                </p>
            </div>
        </div>
    );
};

export default SupplierDetails;
