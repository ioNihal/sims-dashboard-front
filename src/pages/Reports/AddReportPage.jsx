// pages/Reports/AddReportPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/addReportPage.module.css";

const AddReportPage = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("Inventory");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [errors, setErrors] = useState({});
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      const customers = JSON.parse(savedCustomers);
      customers.sort((a, b) => a.name.localeCompare(b.name));
      setCustomerList(customers);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!reportType) newErrors.reportType = "Report type is required.";
    if (!reportTitle.trim()) newErrors.reportTitle = "Report title is required.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.dateRange = "Start date must be before end date.";
    }
    if ((reportType === "Orders" || reportType === "Customers") && !selectedCustomer) {
      newErrors.selectedCustomer = "Please select a customer.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updated report generation logic that uses localStorage data for a Customers report.
  const generateReportSummary = () => {
    let summary = "";
    let chartData = [];
    const now = new Date();

    if (reportType === "Inventory") {
      const savedInventory = localStorage.getItem("inventoryItems");
      if (savedInventory) {
        const items = JSON.parse(savedInventory);
        const categoryMap = {};
        items.forEach((item) => {
          const cat = item.category || "Other";
          categoryMap[cat] = (categoryMap[cat] || 0) + Number(item.quantity);
        });
        summary = `Total Categories: ${Object.keys(categoryMap).length}. `;
        summary += Object.entries(categoryMap)
          .map(([cat, qty]) => `${cat}: ${qty} units`)
          .join("; ");
        chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
      }
    } else if (reportType === "Sales") {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const filteredOrders = orders.filter((o) => {
          const orderDate = new Date(o.orderDate);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
        const totalSales = filteredOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
        summary = `Total Sales: $${totalSales} from ${filteredOrders.length} orders.`;
        chartData = [
          { month: "Jan", sales: 5000 },
          { month: "Feb", sales: 7000 },
          { month: "Mar", sales: 6500 },
        ];
      }
    } else if (reportType === "Orders") {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        let filteredOrders = orders.filter((o) => {
          const orderDate = new Date(o.orderDate);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
        if (selectedCustomer) {
          filteredOrders = filteredOrders.filter(
            (o) =>
              o.customer &&
              o.customer.toLowerCase() === selectedCustomer.toLowerCase()
          );
        }
        const totalOrders = filteredOrders.length;
        const totalAmount = filteredOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
        summary = `Total Orders: ${totalOrders}, Total Amount: $${totalAmount}.`;
        const statusCount = {};
        filteredOrders.forEach((order) => {
          const status = order.orderStatus || "Unknown";
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        chartData = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
        }));
      }
    } else if (reportType === "Customers") {
      // Filter orders for the selected customer within the date range and sort newest first
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders && selectedCustomer) {
        const orders = JSON.parse(savedOrders);
        const filteredOrders = orders
          .filter(
            (o) =>
              o.customer &&
              o.customer.toLowerCase() === selectedCustomer.toLowerCase() &&
              new Date(o.orderDate) >= new Date(startDate) &&
              new Date(o.orderDate) <= new Date(endDate)
          )
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        const totalOrders = filteredOrders.length;
        const totalSales = filteredOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
        // Calculate most bought product
        const productCount = {};
        filteredOrders.forEach((order) => {
          order.orderedItems.forEach((item) => {
            productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
          });
        });
        let mostBoughtProduct = "N/A";
        let maxCount = 0;
        for (const product in productCount) {
          if (productCount[product] > maxCount) {
            mostBoughtProduct = product;
            maxCount = productCount[product];
          }
        }
        summary = `Customer ${selectedCustomer} placed ${totalOrders} orders totaling $${totalSales}. Most bought product: ${mostBoughtProduct} (${maxCount} units).`;
        // For chart, show product frequency distribution
        chartData = Object.entries(productCount).map(([name, value]) => ({ name, value }));
      } else {
        summary = "No orders found for the selected customer and date range.";
        chartData = [];
      }
    } else {
      summary = "No detailed analysis available for this report type.";
      chartData = [{ label: "Sample", val: 100 }];
    }
    return { summary, chartData };
  };

  const handleGenerateReport = () => {
    if (!validate()) return;
    const now = new Date();
    const { summary, chartData } = generateReportSummary();

    const newReport = {
      _id: Date.now(), // pseudo-ID
      type: reportType,
      title: reportTitle,
      description: reportDescription,
      dateRange: { start: startDate, end: endDate },
      customer: (reportType === "Orders" || reportType === "Customers") ? selectedCustomer : "",
      createdAt: now.toISOString(),
      details: `${reportTitle} - ${reportDescription}. ${summary}`,
      chartType: reportType,
      chartData: chartData,
    };

    const savedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const updatedReports = [...savedReports, newReport];
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    alert("Report generated successfully!");
    navigate("/reports");
  };

  const handleCancel = () => {
    navigate("/reports");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Generate Report</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="reportType">Report Type</label>
          <select
            id="reportType"
            className={styles.input}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="Inventory">Inventory</option>
            <option value="Sales">Sales</option>
            <option value="Orders">Orders</option>
            <option value="Customers">Customers</option>
            <option value="Other">Other</option>
          </select>
          {errors.reportType && <span className={styles.error}>{errors.reportType}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="reportTitle">Report Title</label>
          <input
            type="text"
            id="reportTitle"
            className={styles.input}
            placeholder="Enter report title"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
          />
          {errors.reportTitle && <span className={styles.error}>{errors.reportTitle}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="reportDescription">Report Description</label>
          <textarea
            id="reportDescription"
            className={styles.input}
            placeholder="Enter report description"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            rows="3"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {errors.startDate && <span className={styles.error}>{errors.startDate}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {errors.endDate && <span className={styles.error}>{errors.endDate}</span>}
          {errors.dateRange && <span className={styles.error}>{errors.dateRange}</span>}
        </div>
        {(reportType === "Orders" || reportType === "Customers") && (
          <div className={styles.inputGroup}>
            <label htmlFor="customer">Select Customer</label>
            <select
              id="customer"
              className={styles.input}
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">-- Select Customer --</option>
              {customerList.map((cust) => (
                <option key={cust.id} value={cust.name}>
                  {cust.name}
                </option>
              ))}
            </select>
            {errors.selectedCustomer && <span className={styles.error}>{errors.selectedCustomer}</span>}
          </div>
        )}
        <div className={styles.buttonGroup}>
          <button onClick={handleGenerateReport} className={styles.generateBtn}>
            Generate Report
          </button>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReportPage;
