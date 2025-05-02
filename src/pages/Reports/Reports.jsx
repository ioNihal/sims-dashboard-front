import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reports.module.css";
import RefreshButton from "../../components/RefreshButton";
import { capitalize, formatDate } from "../../utils/validators";
import SearchBar from "../../components/SearchBar";
import { deleteReport, fetchReports } from "../../api/reports";
import toast from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchReports();
      setReports(data);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to load reports!");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load();
  }, []);


  const filteredReports = reports.filter(s => {
    const nameMatch = (s.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = (s.type || "").toLowerCase().includes(searchQuery.toLowerCase());
    const dateMatch = s.dateRange && s.dateRange.start
      ? formatDate(s.dateRange.start, false)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      : false;
    return nameMatch || typeMatch || dateMatch;
  });


 
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reports</h1>
      <div className={styles.actions}>
        <Link to="/reports/add">
          <button className={styles.addBtn}>Generate Report</button>
        </Link>

        <div className={styles.rightSide}>
          <RefreshButton onClick={load} loading={loading} />
          <SearchBar
            placeholder="Search Reports..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      <div className={styles.listContainer}>
        {loading ? (
          <p className={styles.loading}>Loading reports...</p>
        ) : filteredReports.length > 0 ? (
          <ul className={styles.reportList}>
            {filteredReports
              .slice()
              .reverse()
              .map((r) => (
                <li key={r._id} className={styles.reportItem}>
                  <div className={styles.reportInfo}>
                    <span className={styles.reportName}>{capitalize(r.name) || r.type + " Report"}</span>
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
      ) : (
      <p className={styles.noReports}>No reports generated yet.</p>
        )}
    </div>
    </div >
  );
};

export default Reports;
