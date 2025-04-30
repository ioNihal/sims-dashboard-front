// src/pages/Reports/ReportDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reportDetails.module.css";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts";

import InventoryReport from "./ReportTypes/InventoryReport";
import CategoryReport from "./ReportTypes/CategoryReport";
import CustomerReport from "./ReportTypes/CustomerReport";
import OrderReport from "./ReportTypes/OrderReport";
import InvoiceReport from "./ReportTypes/InvoiceReport";
import SalesReport from "./ReportTypes/SalesReport";

// simple CSV-download helper (unchanged)
function downloadCSV(rows, filename = "report.csv") {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map(r => keys.map(k => JSON.stringify(r[k], (k, v) => typeof v === "string" ? v.replace(/,/g, "") : v)).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6200ea"];

const ReportDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("reports") || "[]");
    const found = all.find(r => String(r._id) === id);
    if (!found) return nav("/reports");
    setReport(found);
  }, [id, nav]);

  if (!report) return <div className={styles.loading}>Loading…</div>;

  const { name, description, type, dateRange, chartData, dataDetails } = report;

  const renderChart = () => {
    if (!report.chartData)
      return <p className={styles.noChart}>No data</p>;

    // chartData is now an object containing the series for each widget
    const data = report.chartData;

    switch (report.type) {
      case "inventory":
        return <InventoryReport data={data} />;

      case "category":
        return <CategoryReport data={data} />;

      case "customers":
        return <CustomerReport data={data} />;

      case "orders":
        return <OrderReport data={data} />;

      case "invoice":
        return <InvoiceReport data={data} />;

      case "sales":
        return <SalesReport data={data} />;

      default:
        return <p className={styles.noChart}>Unsupported report type</p>;
    }
  };


  return (
    <div className={styles.page}>
      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => nav("/reports")}>Back</button>
        <button className={styles.printBtn} onClick={() => window.print()}>Print</button>
        <button className={styles.csvBtn} onClick={() => downloadCSV(chartData, `${name || type}-report.csv`)}>Export CSV</button>
      </div>
      <div className={styles.card}>
        <div className={styles.topSection}>
          <h1 className={styles.title}>{name || `${type} Report`}</h1>
          <p className={styles.meta}>
            <span>Type: {type}</span>
            <span>Period: {new Date(dateRange.start).toLocaleDateString()} – {new Date(dateRange.end).toLocaleDateString()}</span>
          </p>
          {description && <p className={styles.description}>{description}</p>}
        </div>


        {/* — TEXTUAL SUMMARY DETAILS — */}
        {dataDetails && (
          <div className={styles.detailSection}>
            <h2 className={styles.detailTitle}>Summary</h2>
            <ul className={styles.detailList}>
              {Object.entries(dataDetails).map(([label, val]) => (
                <li key={label}>
                  <strong>{label}:</strong> {val}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.chartWrapper}>{renderChart()}</div>
      </div>
    </div >
  );
};

export default ReportDetails;
