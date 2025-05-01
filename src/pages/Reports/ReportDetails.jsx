// src/pages/Reports/ReportDetails.jsx
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reportDetails.module.css";

import InventoryReport from "./ReportTypes/InventoryReport";
import CategoryReport from "./ReportTypes/CategoryReport";
import CustomerReport from "./ReportTypes/CustomerReport";
import OrderReport from "./ReportTypes/OrderReport";
import InvoiceReport from "./ReportTypes/InvoiceReport";
import SalesReport from "./ReportTypes/SalesReport";
import { deleteReport, fetchReports } from "../../api/reports";
import { capitalize } from "../../utils/validators";
import { ReportDocument } from "../../pdf/ReportDocument";
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';


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

export default function ReportDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);


  const load = async (id) => {
    try {
      const fetched = await fetchReports();
      const singleReport = fetched.find(r => r._id === id);
      if (!singleReport) throw new Error("Report not found");
      setReport(singleReport);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(id);
  }, [id, nav]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>Failed to load report: {error}</p>
          <button onClick={() => nav("/reports")}>Back</button>
        </div>
      </div>
    );
  }

  const { name, description, type, dateRange, chartData, dataDetails } = report;

  const renderChart = () => {
    if (!chartData) return <p className={styles.noChart}>No data</p>;
    switch (type) {
      case "inventory":
        return <InventoryReport data={chartData} />;
      case "category":
        return <CategoryReport data={chartData} />;
      case "customers":
        return <CustomerReport data={chartData} />;
      case "orders":
        return <OrderReport data={chartData} />;
      case "invoice":
        return <InvoiceReport data={chartData} />;
      case "sales":
        return <SalesReport data={chartData} />;
      default:
        return <p className={styles.noChart}>Unsupported report type</p>;
    }
  };

  const handlePrint = async () => {
    try {
      setActionLoading(true);
      // 1) Snapshot chart
      const chartNode = document.getElementById('chart-to-capture');
      if (!chartNode) {
        throw new Error('Chart element not found');
      }

      const canvas = await html2canvas(chartNode, { scale: 2 });
      const chartDataUrl = canvas.toDataURL('image/png');

      // 2) Generate PDF with chart embedded
      const blob = await pdf(
        <ReportDocument report={report} chartImage={chartDataUrl} />
      ).toBlob();

      // 3) Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name || report.type}-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate or download the PDF:', error);
      alert('Something went wrong while generating the PDF. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };


  const handleDelete = async id => {
    try {
      if (!window.confirm("Are you sure you want to delete this report?")) return;
      setActionLoading(true);
      await deleteReport(id);
      nav("/reports");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => nav("/reports")}>
          Back
        </button>
        <button className={styles.dltButton} onClick={() => handleDelete(report._id)} disabled={actionLoading}>
          {`${actionLoading ? "Deleting..." : "Delete"}`}
        </button>
        <div className={styles.saveActions}>
          <button className={styles.printBtn} onClick={handlePrint} disabled={actionLoading}>
            {`${actionLoading ? "Printing..." : "Print"}`}
          </button>
          <button
            className={styles.csvBtn}
            onClick={() => downloadCSV(chartData, `${name || type}-report.csv`)}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.card} >
        <div className={styles.topSection}>
          <h1 className={styles.title}>{capitalize(name) || `${capitalize(type)} Report`}</h1>
          <p className={styles.meta}>
            <span>Type: {capitalize(type)}</span>
            <span>
              Period: {new Date(dateRange.start).toLocaleDateString()} –{" "}
              {new Date(dateRange.end).toLocaleDateString()}
            </span>
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

        <div className={styles.chartWrapper} id="chart-to-capture">{renderChart()}</div>
      </div>
    </div>
  );
}
