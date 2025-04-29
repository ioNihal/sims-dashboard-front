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
        // 1. status distribution
        const statusMap = { in_stock: 0, out_of_stock: 0, low_stock: 0, overstocked: 0 };
        const invInRange = filterByDate(inventory, "createdAt");
        invInRange.forEach(i => {
          // ensure low_stock bucket too
          const status = i.status === "low_stock" ? "low_stock" : i.status;
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

        // 2. quantity by category
        const qtyCat = {};
        invInRange.forEach(i => {
          qtyCat[i.category] = (qtyCat[i.category] || 0) + i.quantity;
        });
        const qtyByCatData = Object.entries(qtyCat).map(([category, qty]) => ({ category, qty }));

        // 3. value by category
        const valCat = {};
        invInRange.forEach(i => {
          const v = i.quantity * i.productPrice;
          valCat[i.category] = (valCat[i.category] || 0) + v;
        });
        const valueByCatData = Object.entries(valCat).map(([category, total]) => ({ category, total }));

        // 4. aging distribution (days in stock)
        const now = new Date();
        const ages = invInRange.map(i => {
          const days = Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24));
          return days;
        });
        // bucket into 0–7,8–30,31–90,90+ days
        const ageBuckets = { "0–7 days": 0, "8–30 days": 0, "31–90 days": 0, "90+ days": 0 };
        ages.forEach(d => {
          if (d <= 7) ageBuckets["0–7 days"]++;
          else if (d <= 30) ageBuckets["8–30 days"]++;
          else if (d <= 90) ageBuckets["31–90 days"]++;
          else ageBuckets["90+ days"]++;
        });
        const agingData = Object.entries(ageBuckets).map(([range, count]) => ({ range, count }));

        // store all in one previewData object
        data = { statusData, qtyByCatData, valueByCatData, agingData };

        // summary details
        details = {
          "Total Items": invInRange.length,
          "Low Stock Items": statusMap.low_stock,
          "Unique Categories": Object.keys(qtyCat).length,
          "Total Stock Value": invInRange.reduce((sum, i) => sum + i.quantity * i.productPrice, 0)
        };
        break;
      }

      case "Category": {
        // first filter to the date-range
        const invInRange = filterByDate(inventory, "createdAt");

        // 1. Quantity by category (existing)
        const qtyMap = {};
        invInRange.forEach(i => {
          qtyMap[i.category] = (qtyMap[i.category] || 0) + i.quantity;
        });
        const qtyData = Object.entries(qtyMap).map(([category, qty]) => ({ category, qty }));

        // 2. Total stock value by category
        const valueMap = {};
        invInRange.forEach(i => {
          const v = i.quantity * i.productPrice;
          valueMap[i.category] = (valueMap[i.category] || 0) + v;
        });
        const valueData = Object.entries(valueMap).map(([category, totalValue]) => ({ category, totalValue }));

        // 3. Distinct SKUs per category
        const skuSet = {};
        invInRange.forEach(i => {
          skuSet[i.category] = skuSet[i.category] || new Set();
          skuSet[i.category].add(i.productId);
        });
        const skuData = Object.entries(skuSet).map(([category, set]) => ({ category, skus: set.size }));

        // 4. Average days in stock per category
        const now = new Date();
        const ageMap = {};
        const countMap = {};
        invInRange.forEach(i => {
          const days = Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24));
          ageMap[i.category] = (ageMap[i.category] || 0) + days;
          countMap[i.category] = (countMap[i.category] || 0) + 1;
        });
        const ageData = Object.entries(ageMap).map(([category, totalDays]) => ({
          category,
          avgDays: totalDays / countMap[category]
        }));

        // pack them all into previewData
        data = { qtyData, valueData, skuData, ageData };

        // summary details
        details = {
          "Total Categories": Object.keys(qtyMap).length,
          "Total Quantity": invInRange.reduce((sum, i) => sum + i.quantity, 0),
          "Total Stock Value": invInRange.reduce((sum, i) => sum + i.quantity * i.productPrice, 0),
          "Max Days in Stock": Math.max(...invInRange.map(i =>
            Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24))
          ))
        };
        break;
      }

      case "Customers": {
        const arr = filterByDate(customers, "createdAt");
        const total = customers.length;
        const newCount = arr.length;
        const activeCount = arr.filter(c => c.orders?.length > 0).length;
        // 1. daily new customers
        const dailyNew = Object.entries(
          arr.reduce((m, c) => {
            const d = c.createdAt.slice(0, 10);
            m[d] = (m[d] || 0) + 1;
            return m;
          }, {})
        ).map(([date, count]) => ({ date, count }));
        // 2. daily active customers
        const dailyActive = Object.entries(
          arr.reduce((m, c) => {
            if (c.orders?.length > 0) {
              const d = c.createdAt.slice(0, 10);
              m[d] = (m[d] || 0) + 1;
            }
            return m;
          }, {})
        ).map(([date, count]) => ({ date, count }));
        // 3. orders per customer
        const ordersPerCust = arr.map(c => ({
          name: c.name,
          orders: c.orders?.length || 0
        }));
        // 4. average orders/day in range
        const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
        const avgPerDay = arr.reduce((sum, c) => sum + (c.orders?.length || 0), 0) / totalDays;
        data = { dailyNew, dailyActive, ordersPerCust, avgPerDay };
        details = {
          "Total Customers": total,
          "New in Range": newCount,
          "Active in Range": activeCount,
          "Avg Orders/Day": avgPerDay.toFixed(2)
        };
        break;
      }

      case "Orders": {
        const arr = filterByDate(orders, "createdAt");
        // 1. count by status
        const byStatus = arr.reduce((m, o) => {
          m[o.status] = (m[o.status] || 0) + 1; return m;
        }, {});
        const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
        // 2. daily orders
        const daily = Object.entries(
          arr.reduce((m, o) => {
            const d = o.createdAt.slice(0, 10);
            m[d] = (m[d] || 0) + 1; return m;
          }, {})
        ).map(([date, count]) => ({ date, count }));
        // 3. revenue by status
        const revByStatus = arr.reduce((m, o) => {
          m[o.status] = (m[o.status] || 0) + o.totalAmount; return m;
        }, {});
        const revenueStatusData = Object.entries(revByStatus).map(([name, value]) => ({ name, value }));
        // 4. average order value
        const avgValue = arr.reduce((s, o) => s + o.totalAmount, 0) / (arr.length || 1);
        data = { statusData, daily, revenueStatusData, avgValue };
        details = {
          "Total Orders": arr.length,
          "Pending": byStatus.pending || 0,
          "Completed": byStatus.completed || 0,
          "Avg Order Value": avgValue.toFixed(2)
        };
        break;
      }

      case "Invoices": {
        const arr = filterByDate(invoices, "createdAt");
        // 1. count by status
        const byStatus = arr.reduce((m, i) => {
          m[i.status] = (m[i.status] || 0) + 1; return m;
        }, {});
        const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
        // 2. daily invoice count
        const dailyCount = Object.entries(
          arr.reduce((m, i) => {
            const d = i.createdAt.slice(0, 10);
            m[d] = (m[d] || 0) + 1; return m;
          }, {})
        ).map(([date, count]) => ({ date, count }));
        // 3. revenue by day
        const dailyRev = Object.entries(
          arr.reduce((m, i) => {
            const d = i.createdAt.slice(0, 10);
            m[d] = (m[d] || 0) + i.amount; return m;
          }, {})
        ).map(([date, total]) => ({ date, total }));
        // 4. average invoice amount
        const avgAmount = arr.reduce((s, i) => s + i.amount, 0) / (arr.length || 1);
        data = { statusData, dailyCount, dailyRev, avgAmount };
        details = {
          "Total Revenue": arr.reduce((s, i) => s + i.amount, 0),
          "Paid": byStatus.paid || 0,
          "Pending": byStatus.pending || 0,
          "Avg Invoice": avgAmount.toFixed(2)
        };
        break;
      }

      case "Sales": {
        const arr = filterByDate(invoices, "createdAt");
        // 1. sales per day
        const salesDaily = Object.entries(
          arr.reduce((m, i) => {
            const d = i.createdAt.slice(0, 10);
            m[d] = (m[d] || 0) + i.amount; return m;
          }, {})
        ).map(([date, total]) => ({ date, total }));
        // 2. cumulative sales
        let cum = 0;
        const salesCumulative = salesDaily
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(d => {
            cum += d.total;
            return { date: d.date, cumulative: cum };
          });
        // 3. average sale per transaction
        const avgSale = arr.reduce((s, i) => s + i.amount, 0) / (arr.length || 1);
        // 4. sales by weekday
        const byWeekday = arr.reduce((m, i) => {
          const wd = new Date(i.createdAt).toLocaleDateString("en-US", { weekday: "short" });
          m[wd] = (m[wd] || 0) + i.amount; return m;
        }, {});
        const weekdayData = Object.entries(byWeekday).map(([day, total]) => ({ day, total }));
        data = { salesDaily, salesCumulative, avgSale, weekdayData };
        details = {
          "Gross Sales": arr.reduce((s, i) => s + i.amount, 0),
          "Transactions": arr.length,
          "Avg Sale": avgSale.toFixed(2),
          "Days Covered": Object.keys(salesDaily).length
        };
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
