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
import { createReport } from "../../api/reports";
import { validateDateRange, clampDateRange } from "../../utils/dateValidation";



const AddReportPage = () => {
  const nav = useNavigate();
  const [isSaving, setSaving] = useState(false);

  // form state
  const [reportName, setReportName] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportType, setReportType] = useState("Inventory");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [previewOn, setPreviewOn] = useState(false);

  // raw data
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // load raw once
  useEffect(() => {
    Promise.allSettled([
      getAllInventoryItems(),
      getAllCustomers(),
      getAllOrders(),
      getAllInvoices()
    ]).then((results) => {
      const [invRes, custRes, ordRes, invcRes] = results;

      if (invRes.status === "fulfilled" && Array.isArray(invRes.value)) {
        setInventory(invRes.value);
      } else {
        console.warn("Inventory fetch failed or returned invalid data", invRes.reason);
      }

      if (custRes.status === "fulfilled" && Array.isArray(custRes.value)) {
        setCustomers(custRes.value);
      } else {
        console.warn("Customers fetch failed or returned invalid data", custRes.reason);
      }

      if (ordRes.status === "fulfilled" && Array.isArray(ordRes.value)) {
        setOrders(ordRes.value);
      } else {
        console.warn("Orders fetch failed or returned invalid data", ordRes.reason);
      }

      if (invcRes.status === "fulfilled" && Array.isArray(invcRes.value)) {
        setInvoices(invcRes.value);
      } else {
        console.warn("Invoices fetch failed or returned invalid data", invcRes.reason);
      }
    });
  }, []);


  // filter helper
  const filterByDate = (arr, key = "createdAt") => {
    console.log(arr)
    if (!startDate || !endDate) return arr;

    // start at 00:00:00.000
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);

    // end at 23:59:59.999
    const e = new Date(endDate);
    e.setHours(23, 59, 59, 999);

    return arr.filter(x => {
      const d = new Date(x[key]);
      return d >= s && d <= e;
    });
  };

  // recompute previewData + details on form change
  const [dataDetails, setDataDetails] = useState({});
  useEffect(() => {
    console.log("Filtering between", startDate, "and", endDate);
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

      case "Invoice": {
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

  const handleSave = async () => {
    if (!reportName || !startDate || !endDate) {
      return ("Name & dates required");
    }

    const { valid, error } = validateDateRange(startDate, endDate);
    if (!valid) {
      setErrors(error);
      return;
    }

    setSaving(true);

    const payload = {
      name: reportName,
      type: reportType,
      description: reportDesc,
      dateRange: { start: startDate, end: endDate },
      chartData: previewData,
      dataDetails
    };

    try {
      await createReport(payload);
      nav("/reports");
    } catch (err) {
      alert("Could not save report: " + err.message);
    } finally {
      setSaving(false);
    }
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
              ) : reportType === "Invoice" ? (
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
              <option value="Invoice">Invoice Report</option>
              <option value="Sales">Sales Report</option>
            </select>
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Description</label>
            <textarea className={styles.input} rows="2" value={reportDesc} onChange={e => setReportDesc(e.target.value)} />
          </div>


          <div className={styles.inputGroup}>
            <label>Start Date</label>
            <input type="date" className={styles.input}
              value={startDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={e => {
                const { start, end } = clampDateRange(e.target.value, endDate);
                setStartDate(start);
                setEndDate(end);
                setErrors("");
              }} />
            {errors && (
              <div className={styles.errorText}>
                {errors}
              </div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label>End Date</label>
            <input type="date" className={styles.input}
              value={endDate}
              min={startDate || undefined}
              max={new Date().toISOString().slice(0, 10)}
              onChange={e => {
                const { start, end } = clampDateRange(startDate, e.target.value);
                setStartDate(start);
                setEndDate(end);
                setErrors("");
              }} />
            {errors && (
              <div className={styles.errorText}>
                {errors}
              </div>
            )}
          </div>

          <div className={styles.btnGroup}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>{`${isSaving ? "Saving..." : "Save"}`}</button>
            <button className={styles.cancelBtn} onClick={() => nav("/reports")}>Cancel</button>
          </div>

        </div>)
      }


    </div>
  );
};

export default AddReportPage;
