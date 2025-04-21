// pages/Invoices/InvoiceDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Invoices/invoiceDetails.module.css";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    // Load saved invoices and customers from localStorage
    const savedInvoices = localStorage.getItem("invoices");
    const savedCustomers = localStorage.getItem("customers");

    if (savedInvoices) {
      const invArr = JSON.parse(savedInvoices);
      const foundInv = invArr.find((inv) => String(inv._id) === id);
      if (foundInv) {
        setInvoice(foundInv);
        // If customerId exists, try to fetch detailed customer info
        if (savedCustomers && foundInv.customerId) {
          const custArr = JSON.parse(savedCustomers);
          const foundCust = custArr.find(
            (c) => String(c.id) === String(foundInv.customerId)
          );
          if (foundCust) {
            setCustomerData(foundCust);
          }
        }
      } else {
        alert("Invoice not found");
        navigate("/invoices");
      }
    } else {
      alert("No invoices found");
      navigate("/invoices");
    }
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      const invArr = JSON.parse(savedInvoices);
      const updatedInvoices = invArr.filter((inv) => String(inv._id) !== id);
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
      alert("Invoice deleted successfully!");
    }
    navigate("/invoices");
  };

  if (!invoice) {
    return <div className={styles.loading}>Loading Invoice...</div>;
  }

  // Use detailed customer data if available, otherwise fallback to invoice fields
  const customerInfo = customerData || {
    name: invoice.customer,
    email: invoice.email,
    phone: invoice.phone,
    address: invoice.address,
  };

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/invoices")}>
        Back
      </button>
      <div className={styles.invoiceCard}>
        <div className={styles.header}>
          <h1>INVOICE</h1>
          <button className={styles.printBtn} onClick={handlePrint}>
            Print
          </button>
        </div>
        <div className={styles.customerSection}>
          <h2>Customer Details</h2>
          <p>
            <strong>Name:</strong> {customerInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {customerInfo.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {customerInfo.phone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {customerInfo.address || "N/A"}
          </p>
        </div>
        <div className={styles.ordersSection}>
          <h2>Order Details</h2>
          {invoice.orders &&
            invoice.orders.map((order) => (
              <div key={order.id} className={styles.orderBlock}>
                <div className={styles.orderHeader}>
                  <p><strong>Order No:</strong> {order.orderNumber}</p>
                  <p><strong>Date:</strong> {order.orderDate}</p>
                  <p><strong>Status:</strong> {order.orderStatus}</p>
                  <p><strong>Total:</strong> ${order.totalAmount}</p>
                </div>
                <div className={styles.responsiveTable}>
                  <table className={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderedItems.map((item) => (
                        <tr key={item.id}>
                          <td data-label="Item">{item.name}</td>
                          <td data-label="Qty">{item.quantity}</td>
                          <td data-label="Price">${item.price}</td>
                          <td data-label="Subtotal">${item.quantity * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          {invoice.orders && invoice.orders.length > 1 && (
            <div className={styles.combinedTotal}>
              <h3>Combined Total: ${invoice.totalAmount}</h3>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Delete Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
