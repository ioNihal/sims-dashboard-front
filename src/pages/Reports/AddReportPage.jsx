// src/pages/Reports/AddReportPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/addReportPage.module.css";

import { getAllInventoryItems } from "../../api/inventory";
import { getAllCustomers } from "../../api/customers";
import { getAllOrders } from "../../api/orders";
import { getAllInvoices } from "../../api/invoice";
import InventoryReport from "./ReportTypes/InventoryReport";
import CategoryReport from "./ReportTypes/CategoryReport";
import CustomerReport from "./ReportTypes/CustomerReport";
import OrderReport from "./ReportTypes/OrderReport";
import InvoiceReport from "./ReportTypes/InvoiceReport";
import SalesReport from "./ReportTypes/SalesReport";
import {
  generateCategoryReport,
  generateCustomerReport,
  generateInventoryReport,
  generateInvoiceReport,
  generateOrderReport,
  generateSalesReport
} from "../../services/reportHelpers";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6200ea"];

const AddReportPage = () => {
  const nav = useNavigate();

  // form state
  const [reportName, setReportName] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportType, setReportType] = useState("Inventory");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [previewOn, setPreviewOn] = useState(false);

  // raw data
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // load raw once
  useEffect(() => {
    Promise.all([
      getAllInventoryItems(),
      getAllCustomers(),
      getAllOrders(),
      getAllInvoices()
    ]).then(([inv, cust, ord, invc]) => {
      setInventory(inv);
      setCustomers(cust);
      setOrders(ord);
      setInvoices(invc);
    });
  }, []);

  // filter helper
  const filterByDate = (arr, key = "createdAt") => {
    if (!startDate || !endDate) return arr;
    const s = new Date(startDate), e = new Date(endDate);
    return arr.filter(x => {
      const d = new Date(x[key]);
      return d >= s && d <= e;
    });
  };

  // recompute previewData + details on form change
  const [dataDetails, setDataDetails] = useState({});
  useEffect(() => {
    if (!startDate || !endDate) { setPreviewData(null); setDataDetails({}); return; }
    let data = [];
    let details = {};

    switch (reportType) {
      case "Inventory": {
        const { data: previewDataSet, details: previewDetails } =
          generateInventoryReport(inventory, startDate, endDate, filterByDate);
        data = previewDataSet;
        details = previewDetails;
        break;
      }

      case "Category": {
        const { data: previewDataSet, details: previewDetails } =
          generateCategoryReport(inventory, startDate, endDate, filterByDate);
        data = previewDataSet;
        details = previewDetails;
        break;
      }

      case "Customers": {
        const { data: previewDataSet, details: previewDetails } =
          generateCustomerReport(customers, orders, startDate, endDate, filterByDate);
        data = previewDataSet;
        details = previewDetails;
        break;
      }


      case "Orders": {
        const { data: previewDataSet, details: previewDetails } =
          generateOrderReport(orders, startDate, endDate, filterByDate);
        data = previewDataSet;
        details = previewDetails;
        break;
      }

      case "Invoices": {
        const { data: previewDataSet, details: previewDetails } =
          generateInvoiceReport(invoices, startDate, endDate, filterByDate);
        data = previewDataSet;
        details = previewDetails;
        break;
      }

      case "Sales": {
        const { data: previewDataSet, details: previewDetails } =
          generateSalesReport(invoices, startDate, endDate, filterByDate);
        data = previewDataSet;
        details = previewDetails;
        break;
      }
      default: break;
    }

    setPreviewData(data);
    setDataDetails(details);
  }, [reportType, startDate, endDate, inventory, customers, orders, invoices]);

  const handleSave = () => {
    if (!reportName || !startDate || !endDate) return alert("Name & dates required");
    const saved = JSON.parse(localStorage.getItem("reports") || "[]");
    saved.push({
      _id: Date.now(),
      name: reportName,
      description: reportDesc,
      type: reportType,
      dateRange: { start: startDate, end: endDate },
      chartData: previewData,
      dataDetails
    });
    localStorage.setItem("reports", JSON.stringify(saved));
    nav("/reports");
  };

  return (
    <div className={styles.page}>
      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => nav("/reports")}>
          Back
        </button>
        {previewData && (<button className={styles.previewBtn} onClick={() => {
          setPreviewOn(!previewOn);
        }}>
          {previewOn ? "close" : "Preview"}
        </button>)}
      </div>
      <h1 className={styles.title}>Create Report</h1>
      {
        previewData && previewOn ? (
          <div className={styles.preview}>
            <h2 className={styles.previewTitle}>{reportType} Preview</h2>
            <div className={styles.detailSection}>
              <h3>Details</h3>
              <ul className={styles.detailList}>
                {Object.entries(dataDetails).map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
            <div className={styles.chartContainer}>
              {reportType === "Inventory" ? (
                <InventoryReport data={previewData} />
              ) : reportType === "Category" ? (
                <CategoryReport data={previewData} />
              ) : reportType === "Customers" ? (
                <CustomerReport data={previewData} />
              ) : reportType === "Orders" ? (
                <OrderReport data={previewData} />
              ) : reportType === "Invoices" ? (
                <InvoiceReport data={previewData} />
              ) : reportType === "Sales" ? (
                <SalesReport data={previewData} />
              ) : null}
            </div>
          </div>
        ) : (<div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Report Name</label>
            <input className={styles.input} value={reportName} onChange={e => setReportName(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>Type</label>
            <select className={styles.input} value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="Inventory">Inventory Report</option>
              <option value="Category">Category-wise Report</option>
              <option value="Customers">Customer Report</option>
              <option value="Orders">Order Report</option>
              <option value="Invoices">Payment/Invoice Report</option>
              <option value="Sales">Sales Report</option>
            </select>
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Description</label>
            <textarea className={styles.input} rows="2" value={reportDesc} onChange={e => setReportDesc(e.target.value)} />
          </div>


          <div className={styles.inputGroup}>
            <label>Start Date</label>
            <input type="date" className={styles.input} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>End Date</label>
            <input type="date" className={styles.input} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          <div className={styles.btnGroup}>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            <button className={styles.cancelBtn} onClick={() => nav("/reports")}>Cancel</button>
          </div>

        </div>)
      }


    </div >
  );
};

export default AddReportPage;
