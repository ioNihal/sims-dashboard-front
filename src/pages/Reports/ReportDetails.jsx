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
    if (!chartData?.length) return <p className={styles.noChart}>No data</p>;

    // Sales → line chart of revenue by date
    if (type === "Sales") {
      return (
        <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke={COLORS[0]} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Orders → bar chart of order count by date
    if (type === "Orders") {
      return (
        <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={COLORS[1]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Inventory status, Category-wise, Invoices → pie chart
    if (type === "Inventory" || type === "Category" || type === "Invoices") {
      return (
        <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%" cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Customers → line chart of customer count by date
    if (type === "Customers") {
      return (
        <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke={COLORS[2]} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Fallback
    return <p className={styles.noChart}>Unsupported report type</p>;
  };

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => nav("/reports")}>← Back</button>

      <div className={styles.card}>
        <h1 className={styles.title}>{name || `${type} Report`}</h1>
        <p className={styles.meta}>
          <strong>Type:</strong> {type} |
          <strong>Period:</strong> {new Date(dateRange.start).toLocaleDateString()} – {new Date(dateRange.end).toLocaleDateString()}
        </p>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.chartWrapper}>{renderChart()}</div>

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
      </div>

      <div className={styles.actions}>
        <button className={styles.printBtn} onClick={() => window.print()}>Print</button>
        <button className={styles.csvBtn} onClick={() => downloadCSV(chartData, `${name || type}-report.csv`)}>Download CSV</button>
      </div>
    </div>
  );
};

export default ReportDetails;
