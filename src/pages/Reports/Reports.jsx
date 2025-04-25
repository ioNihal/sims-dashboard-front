import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reports.module.css";
import RefreshButton from "../../components/RefreshButton";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchReports = () => {
    setLoading(true);
    const arr = JSON.parse(localStorage.getItem("reports") || "[]");
    setReports(arr);
    setLoading(false);
  }
  useEffect(() => {
    fetchReports();
  }, []);

  if (reports.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Reports</h1>
        <p className={styles.noReports}>No reports generated yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reports</h1>
      <div className={styles.actions}>
        <Link to="/reports/add">
          <button className={styles.addBtn}>Generate Report</button>
        </Link>

        <div className={styles.rightSide}>
          <RefreshButton onClick={fetchReports} loading={loading} />
          {/* <SearchBar
            placeholder="Search Reports..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          /> */}
        </div>
      </div>
      <ul className={styles.reportList}>
        {reports
          .slice()
          .reverse()
          .map((r) => (
            <li key={r._id} className={styles.reportItem}>
              <div className={styles.reportInfo}>
                <span className={styles.reportName}>{r.name || r.type + " Report"}</span>
                <span className={styles.reportMeta}>
                  {r.type} • {new Date(r.dateRange.start).toLocaleDateString()} –{" "}
                  {new Date(r.dateRange.end).toLocaleDateString()}
                </span>
              </div>
              <button
                className={styles.viewBtn}
                onClick={() => nav(`/reports/view/${r._id}`)}
              >
                View
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Reports;
