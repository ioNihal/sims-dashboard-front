// pages/Reports/ReportDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reportDetails.module.css";
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

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#6200ea"];

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);

    useEffect(() => {
        const savedReports = localStorage.getItem("reports");
        if (savedReports) {
            const reportsArr = JSON.parse(savedReports);
            const foundReport = reportsArr.find((r) => String(r._id) === id);
            if (foundReport) {
                setReport(foundReport);
            } else {
                alert("Report not found");
                navigate("/reports");
            }
        } else {
            alert("No reports available");
            navigate("/reports");
        }
    }, [id, navigate]);

    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        const savedReports = localStorage.getItem("reports");
        if (savedReports) {
            const reportsArr = JSON.parse(savedReports);
            const updatedReports = reportsArr.filter((r) => String(r._id) !== id);
            localStorage.setItem("reports", JSON.stringify(updatedReports));
            alert("Report deleted successfully!");
        }
        navigate("/reports");
    };

    if (!report) {
        return <div className={styles.loading}>Loading Report...</div>;
    }

    // Render a chart based on report.chartType & report.chartData
    const renderChart = () => {
        if (!report.chartData || report.chartData.length === 0) return null;
        if (report.chartType === "Inventory" || report.chartType === "Customers") {
            // Use a Pie Chart for Inventory/Customer reports
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={report.chartData} dataKey="value" nameKey="name" outerRadius={100} label>
                            {report.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        } else if (report.chartType === "Sales") {
            // Use a Bar Chart for Sales report
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.chartData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#6200ea" />
                    </BarChart>
                </ResponsiveContainer>
            );
        } else if (report.chartType === "Orders") {
            // Use a Bar Chart for Orders report
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.chartData}>
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#6200ea" />
                    </BarChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <p className={styles.noChart}>
                    No specific chart for report type: {report.chartType}.
                </p>
            );
        }
    };

    return (
        <div className={styles.page}>
            <button className={styles.backButton} onClick={() => navigate("/reports")}>
                Back
            </button>
            <div className={styles.card}>
                <p className={styles.reportDate}>
                    Created: {new Date(report.createdAt).toLocaleString()}
                </p>
                <h2 className={styles.reportType}>{report.type} Report</h2>
                {report.title && <h3 className={styles.reportTitle}>{report.title}</h3>}
                {report.description && <p className={styles.reportDescription}>{report.description}</p>}
                <p className={styles.reportDetails}>{report.details}</p>

                {/* Render the chart if available */}
                <div className={styles.chartSection}>{renderChart()}</div>

                <div className={styles.actions}>
                    <button className={styles.printBtn} onClick={handlePrint}>
                        Print
                    </button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
