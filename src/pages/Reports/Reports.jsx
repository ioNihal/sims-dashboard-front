import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/reports.module.css";
import RefreshButton from "../../components/RefreshButton";
import { capitalize, formatDate } from "../../utils/validators";
import SearchBar from "../../components/SearchBar";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://suims.vercel.app/api/report");
      const data = await res.json();
      if (!res.ok) throw new Error("Something wrong")
      setReports(data.reports);
      setLoading(false);
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    fetchReports();
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


  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://suims.vercel.app/api/report/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.log(err)
    } finally {
      fetchReports();
    }
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
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleDelete(r._id)}
                  >
                  DELETE
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
