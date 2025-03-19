// pages/Reports/Reports.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reports.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState("Inventory");
  const navigate = useNavigate();

  // Example system-wide chart data (for the main page)
  const [ordersData, setOrdersData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#6200ea"];

  useEffect(() => {
    // Load existing "reports" from localStorage
    const savedReports = localStorage.getItem("reports");
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }

    // Example data for overall system (these charts are optional)
    setOrdersData([
      { status: "Completed", count: 3 },
      { status: "Pending", count: 2 },
    ]);
    setInventoryData([
      { name: "Milk", value: 100 },
      { name: "Soap", value: 50 },
    ]);
  }, []);

  const saveReportsToLocalStorage = (updatedReports) => {
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  // (Optional) A button could be used to auto-generate a dummy report
  // But with the new AddReportPage, you may remove this function.
  const handleGenerateReport = () => {
    const now = new Date();
    let chartData = [];
    if (reportType === "Inventory") {
      chartData = [
        { name: "Milk", value: 80 },
        { name: "Soap", value: 40 },
      ];
    } else if (reportType === "Sales") {
      chartData = [
        { month: "Jan", sales: 5000 },
        { month: "Feb", sales: 7000 },
      ];
    } else if (reportType === "Orders") {
      chartData = [
        { status: "Completed", count: 5 },
        { status: "Cancelled", count: 2 },
      ];
    } else {
      chartData = [{ label: "Sample", val: 100 }];
    }

    const newReport = {
      _id: Date.now(),
      type: reportType,
      createdAt: now.toISOString(),
      details: `Sample ${reportType} report generated on ${now.toLocaleString()}.`,
      chartType: reportType,
      chartData: chartData,
    };

    const updatedReports = [...reports, newReport];
    saveReportsToLocalStorage(updatedReports);
  };

  // Print the entire page (optional)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reports</h1>

      {/* Action Controls */}
      <div className={styles.actions}>
        {/* "Add Report" navigates to a dedicated AddReportPage */}
        <button
          className={styles.addReportBtn}
          onClick={() => navigate("/reports/add")}
        >
          Add Report
        </button>
        <button className={styles.printBtn} onClick={handlePrint}>
          Print Page
        </button>
      </div>

      {/* Optional: Global Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Orders by Status</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6200ea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Inventory by Category</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Generated Reports List */}
      <div className={styles.reportList}>
        {reports.length === 0 ? (
          <p className={styles.noReports}>No reports generated yet.</p>
        ) : (
          reports
            .slice()
            .reverse()
            .map((report) => (
              <div key={report._id} className={styles.reportCard}>
                <p className={styles.reportDate}>
                  Created: {new Date(report.createdAt).toLocaleString()}
                </p>
                <h3 className={styles.reportType}>{report.type} Report</h3>
                <p className={styles.reportDetails}>{report.details}</p>
                <button
                  className={styles.viewBtn}
                  onClick={() => navigate(`/reports/view/${report._id}`)}
                >
                  View
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Reports;
