import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/addReportPage.module.css";

import { getAllInventoryItems } from "../../api/inventory";
import { getSuppliers }         from "../../api/suppliers";
import { getAllCustomers }      from "../../api/customers";
import { getAllOrders }         from "../../api/orders";
import { getAllInvoices }       from "../../api/invoice";

const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042","#6200ea"];

const AddReportPage = () => {
  const nav = useNavigate();

  // form state
  const [reportName, setReportName]         = useState("");
  const [reportDesc, setReportDesc]         = useState("");
  const [reportType, setReportType]         = useState("Sales");
  const [startDate, setStartDate]           = useState("");
  const [endDate, setEndDate]               = useState("");
  const [previewData, setPreviewData]       = useState(null);

  // raw data
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders]       = useState([]);
  const [invoices, setInvoices]   = useState([]);

  // load raw once
  useEffect(() => {
    Promise.all([
      getAllInventoryItems(),
      getAllOrders(),
      getAllInvoices()
    ]).then(([inv, ord, invc]) => {
      setInventory(inv);
      setOrders(ord);
      setInvoices(invc);
    });
  }, []);

  // filter by date-range
  const filterByDate = (arr, dateKey) => {
    if (!startDate || !endDate) return arr;
    const start = new Date(startDate), end = new Date(endDate);
    return arr.filter(x => {
      const d = new Date(x[dateKey]);
      return d >= start && d <= end;
    });
  };

  // compute chartData on form change
  useEffect(() => {
    if (!startDate || !endDate) {
      setPreviewData(null);
      return;
    }
    const from = new Date(startDate), to = new Date(endDate);

    let chartData = {};
    switch (reportType) {
      case "Sales":
        {
          const data = filterByDate(invoices, "createdAt")
            .reduce((acc,i) => {
              const d = i.createdAt.slice(0,10);
              acc[d] = (acc[d]||0) + i.amount;
              return acc;
            }, {});
          chartData = Object.entries(data).map(([date,total])=>({ date, total }));
        }
        break;

      case "Orders":
        {
          const data = filterByDate(orders, "createdAt")
            .reduce((acc,o)=>{
              const d=o.createdAt.slice(0,10);
              acc[d]=(acc[d]||0)+1;
              return acc;
            },{});
          chartData = Object.entries(data).map(([date,count])=>({ date, count }));
        }
        break;

      case "Inventory":
        {
          const data = inventory
            .reduce((acc,i)=>{
              if(new Date(i.createdAt)>=from && new Date(i.createdAt)<=to){
                acc[i.status] = (acc[i.status]||0)+1;
              }
              return acc;
            },{});
          chartData = Object.entries(data).map(([name,value])=>({ name,value }));
        }
        break;

      default:
        chartData = [];
    }
    setPreviewData(chartData);
  }, [reportType, startDate, endDate, inventory, orders, invoices]);

  const handleSave = () => {
    if (!reportName || !startDate || !endDate) {
      return alert("Name, start and end dates are required");
    }
    const saved = JSON.parse(localStorage.getItem("reports")||"[]");
    saved.push({
      _id: Date.now(),
      name: reportName,
      description: reportDesc,
      type: reportType,
      dateRange: { start: startDate, end: endDate },
      chartData: previewData
    });
    localStorage.setItem("reports", JSON.stringify(saved));
    nav("/reports");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Report</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Report Name</label>
          <input
            className={styles.input}
            value={reportName}
            onChange={e=>setReportName(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea
            className={styles.input}
            rows="2"
            value={reportDesc}
            onChange={e=>setReportDesc(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Type</label>
          <select
            className={styles.input}
            value={reportType}
            onChange={e=>setReportType(e.target.value)}
          >
            <option value="Sales">Sales</option>
            <option value="Orders">Orders</option>
            <option value="Inventory">Inventory Status</option>
          </select>
        </div>
        <div className={styles.dateRow}>
          <div className={styles.inputGroup}>
            <label>Start Date</label>
            <input
              type="date"
              className={styles.input}
              value={startDate}
              onChange={e=>setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>End Date</label>
            <input
              type="date"
              className={styles.input}
              value={endDate}
              onChange={e=>setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button className={styles.generateBtn} onClick={handleSave}>
          Save Report
        </button>
      </div>

      {previewData && (
        <div className={styles.preview}>
          <h2 className={styles.previewTitle}>Preview: {reportType}</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
              {reportType === "Sales" && (
                <LineChart data={previewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke={COLORS[0]} strokeWidth={2}/>
                </LineChart>
              )}
              {reportType === "Orders" && (
                <BarChart data={previewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={COLORS[1]} barSize={20}/>
                </BarChart>
              )}
              {reportType === "Inventory" && (
                <PieChart>
                  <Pie
                    data={previewData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={80} label
                  >
                    {previewData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReportPage;
