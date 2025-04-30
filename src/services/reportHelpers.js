

/**
 * Generates inventory report data and summary details.
 *
 * @param {Array} inventory - Array of inventory items
 * @param {string} startDate - ISO date string for range start (YYYY-MM-DD)
 * @param {string} endDate - ISO date string for range end (YYYY-MM-DD)
 * @param {function} filterByDate - helper to filter array by createdAt between dates
 * @returns {{ data: { statusData: Array, qtyByCatData: Array, valueByCatData: Array, agingData: Array }, details: Object }}
 */
export function generateInventoryReport(inventory, startDate, endDate, filterByDate) {
  // 1. status distribution
  const statusMap = { in_stock: 0, out_of_stock: 0, low_stock: 0, overstocked: 0 };
  const invInRange = filterByDate(inventory, "createdAt");
  console.log(invInRange)
  invInRange.forEach(i => {
    const status = i.status === "low_stock" ? "low_stock" : i.status;
    statusMap[status] = (statusMap[status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // 2. quantity by category
  const qtyCat = {};
  invInRange.forEach(i => {
    qtyCat[i.category] = (qtyCat[i.category] || 0) + i.quantity;
  });
  const qtyByCatData = Object.entries(qtyCat).map(([category, qty]) => ({ category, qty }));

  // 3. value by category
  const valCat = {};
  invInRange.forEach(i => {
    const v = i.quantity * i.productPrice;
    valCat[i.category] = (valCat[i.category] || 0) + v;
  });
  const valueByCatData = Object.entries(valCat).map(([category, total]) => ({ category, total }));

  // 4. aging distribution (days in stock)
  const now = new Date();
  const ageBuckets = { "0–7 days": 0, "8–30 days": 0, "31–90 days": 0, "90+ days": 0 };
  invInRange.forEach(i => {
    const days = Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24));
    if (days <= 7) ageBuckets["0–7 days"]++;
    else if (days <= 30) ageBuckets["8–30 days"]++;
    else if (days <= 90) ageBuckets["31–90 days"]++;
    else ageBuckets["90+ days"]++;
  });
  const agingData = Object.entries(ageBuckets).map(([range, count]) => ({ range, count }));

  // summary details
  const details = {
    "Total Items": invInRange.length,
    "Low Stock Items": statusMap.low_stock,
    "Unique Categories": Object.keys(qtyCat).length,
    "Total Stock Value": invInRange.reduce((sum, i) => sum + i.quantity * i.productPrice, 0)
  };

  const data = { statusData, qtyByCatData, valueByCatData, agingData };
  return { data, details };
}



/**
* Generates category-dashboard data and summary details.
*
* @param {Array} inventory    – array of inventory items
* @param {string} startDate   – “YYYY-MM-DD” string
* @param {string} endDate     – “YYYY-MM-DD” string
* @param {Function} filterByDate(arr, key) – your existing date-filter helper
* @returns {{ data: { qtyData, valueData, skuData, ageData }, details: Object }}
*/
export function generateCategoryReport(inventory, startDate, endDate, filterByDate) {
  const invInRange = filterByDate(inventory, "createdAt");
  console.log(invInRange)
  // 1. Quantity by category
  const qtyMap = {};
  invInRange.forEach(i => {
    qtyMap[i.category] = (qtyMap[i.category] || 0) + i.quantity;
  });
  const qtyData = Object.entries(qtyMap)
    .map(([category, qty]) => ({ category, qty }));

  // 2. Total stock value by category
  const valueMap = {};
  invInRange.forEach(i => {
    const v = i.quantity * i.productPrice;
    valueMap[i.category] = (valueMap[i.category] || 0) + v;
  });
  const valueData = Object.entries(valueMap)
    .map(([category, totalValue]) => ({ category, totalValue }));

  // 3. Distinct SKUs per category
  const skuSet = {};
  invInRange.forEach(i => {
    skuSet[i.category] = skuSet[i.category] || new Set();
    skuSet[i.category].add(i.productId);
  });
  const skuData = Object.entries(skuSet)
    .map(([category, set]) => ({ category, skus: set.size }));

  // 4. Average days in stock per category
  const now = new Date();
  const ageMap = {}, countMap = {};
  invInRange.forEach(i => {
    const days = Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24));
    ageMap[i.category] = (ageMap[i.category] || 0) + days;
    countMap[i.category] = (countMap[i.category] || 0) + 1;
  });
  const ageData = Object.entries(ageMap).map(([category, totalDays]) => ({
    category,
    avgDays: totalDays / countMap[category]
  }));

  // summary details
  const details = {
    "Total Categories": Object.keys(qtyMap).length,
    "Total Quantity": invInRange.reduce((sum, i) => sum + i.quantity, 0),
    "Total Stock Value": invInRange.reduce((sum, i) => sum + i.quantity * i.productPrice, 0),
    "Max Days in Stock": Math.max(...invInRange.map(i =>
      Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24))
    ))
  };

  return {
    data: { qtyData, valueData, skuData, ageData },
    details
  };
}




/**
 * Generates all four customer‐report series plus summary details.
 *
 * @param {Array} customers    – full customers array
 * @param {Array} orders       – full orders array
 * @param {string} startDate   – “YYYY-MM-DD”
 * @param {string} endDate     – “YYYY-MM-DD”
 * @param {Function} filterByDate(arr, key) – your date-filter helper
 * @returns {{ data: { dailyNew, dailyActive, ordersPerCust, avgPerDay }, details: Object }}
 */
export function generateCustomerReport(customers, orders, startDate, endDate, filterByDate) {
  // 1. filter both arrays by date
  const custInRange = filterByDate(customers, "createdAt");
  const ordersInRange = filterByDate(orders, "createdAt");

  // 2. lookup orders by customerId
  const ordersByCustId = ordersInRange.reduce((map, o) => {
    const cid = o.customerId._id;
    (map[cid] = map[cid] || []).push(o);
    return map;
  }, {});

  // 3. totals
  const totalCustomers = customers.length;
  const newCustomers = custInRange.length;
  const activeCustomers = custInRange.filter(c => (ordersByCustId[c._id] || []).length > 0).length;

  // 4. daily new customers
  const dailyNew = Object.entries(
    custInRange.reduce((m, c) => {
      const d = c.createdAt.slice(0, 10);
      m[d] = (m[d] || 0) + 1;
      return m;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  // 5. daily active (count each cust on their first order date)
  const firstOrderDateByCust = Object.fromEntries(
    ordersInRange
      .map(o => [o.customerId._id, o.createdAt.slice(0, 10)])
      .sort((a, b) => a[1].localeCompare(b[1]))
      .filter(([, d], i, arr) => arr.findIndex(x => x[0] === arr[i][0]) === i)
  );
  const dailyActive = Object.entries(
    Object.values(firstOrderDateByCust)
      .reduce((m, d) => { m[d] = (m[d] || 0) + 1; return m; }, {})
  ).map(([date, count]) => ({ date, count }));

  // 6. orders per customer
  const ordersPerCust = custInRange.map(c => ({
    name: c.name,
    orders: (ordersByCustId[c._id] || []).length
  }));

  // 7. average orders per day
  const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
  const avgPerDay = +(ordersInRange.length / days).toFixed(2);

  return {
    data: {
      dailyNew,
      dailyActive,
      ordersPerCust,
      avgPerDay
    },
    details: {
      "Total Customers": totalCustomers,
      "New in Range": newCustomers,
      "Active in Range": activeCustomers,
      "Avg Orders/Day": avgPerDay
    }
  };
}


/**
 * Generates all four Orders‐report series plus summary details.
 *
 * @param {Array} orders        – full orders array
 * @param {string} startDate    – “YYYY-MM-DD”
 * @param {string} endDate      – “YYYY-MM-DD”
 * @param {Function} filterByDate(arr, key) – your date-filter helper
 * @returns {{
*   data: {
*     statusData: Array<{name:string,value:number}>,
*     daily: Array<{date:string,count:number}>,
*     revenueStatusData: Array<{name:string,value:number}>,
*     avgValue: number
*   },
*   details: {
*     "Total Orders": number,
*     "Pending": number,
*     "Completed": number,
*     "Avg Order Value": string
*   }
* }}
*/
export function generateOrderReport(orders, startDate, endDate, filterByDate) {
  // 1. filter by date
  const arr = filterByDate(orders, "createdAt");
  console.log(arr)

  // 2. count by status
  const byStatus = arr.reduce((m, o) => {
    m[o.status] = (m[o.status] || 0) + 1;
    return m;
  }, {});
  const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  // 3. daily orders (sorted oldest→newest)
  const daily = Object.entries(
    arr.reduce((m, o) => {
      const d = o.createdAt.slice(0, 10);
      m[d] = (m[d] || 0) + 1;
      return m;
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 4. revenue by status
  const revByStatus = arr.reduce((m, o) => {
    m[o.status] = (m[o.status] || 0) + o.totalAmount;
    return m;
  }, {});
  const revenueStatusData = Object.entries(revByStatus).map(([name, value]) => ({ name, value }));

  // 5. average order value
  const avgValue = arr.reduce((s, o) => s + o.totalAmount, 0) / (arr.length || 1);

  const data = { statusData, daily, revenueStatusData, avgValue };
  const details = {
    "Total Orders": arr.length,
    "Pending": byStatus.pending || 0,
    "Completed": byStatus.completed || 0,
    "Avg Order Value": avgValue.toFixed(2)
  };

  return { data, details };
}




/**
 * Generates all four Invoices‐report series plus summary details.
 *
 * @param {Array} invoices      – full invoices array
 * @param {string} startDate    – “YYYY-MM-DD”
 * @param {string} endDate      – “YYYY-MM-DD”
 * @param {Function} filterByDate(arr, key) – your date-filter helper
 * @returns {{
*   data: {
*     statusData: Array<{name:string,value:number}>,
*     dailyCount: Array<{date:string,count:number}>,
*     dailyRev: Array<{date:string,total:number}>,
*     avgAmount: number
*   },
*   details: {
*     "Total Revenue": number,
*     "Paid": number,
*     "Pending": number,
*     "Avg Invoice": string
*   }
* }}
*/
export function generateInvoiceReport(invoices, startDate, endDate, filterByDate) {
  // 1. filter by date
  const arr = filterByDate(invoices, "createdAt");
  console.log(arr)
  // 2. count by status
  const byStatus = arr.reduce((m, i) => {
    m[i.status] = (m[i.status] || 0) + 1;
    return m;
  }, {});
  const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  // 3. daily invoice count (sorted oldest→newest)
  const dailyCount = Object.entries(
    arr.reduce((m, i) => {
      const d = i.createdAt.slice(0, 10);
      m[d] = (m[d] || 0) + 1;
      return m;
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 4. revenue by day
  const dailyRev = Object.entries(
    arr.reduce((m, i) => {
      const d = i.createdAt.slice(0, 10);
      m[d] = (m[d] || 0) + i.amount;
      return m;
    }, {})
  ).map(([date, total]) => ({ date, total }));

  // 5. average invoice amount
  const avgAmount = arr.reduce((s, i) => s + i.amount, 0) / (arr.length || 1);

  const data = { statusData, dailyCount, dailyRev, avgAmount };
  const details = {
    "Total Revenue": arr.reduce((s, i) => s + i.amount, 0),
    "Paid": byStatus.paid || 0,
    "Pending": byStatus.pending || 0,
    "Avg Invoice": avgAmount.toFixed(2)
  };

  return { data, details };
}




/**
 * Generates all four Sales‐report series plus summary details.
 *
 * @param {Array} invoices      – full invoices array
 * @param {string} startDate    – “YYYY-MM-DD”
 * @param {string} endDate      – “YYYY-MM-DD”
 * @param {Function} filterByDate(arr, key) – your date-filter helper
 * @returns {{
*   data: {
*     salesDaily: Array<{date:string,total:number}>,
*     salesCumulative: Array<{date:string,cumulative:number}>,
*     avgSale: number,
*     weekdayData: Array<{day:string,total:number}>
*   },
*   details: {
*     "Gross Sales": number,
*     "Transactions": number,
*     "Avg Sale": string,
*     "Days Covered": number
*   }
* }}
*/
export function generateSalesReport(invoices, startDate, endDate, filterByDate) {
  // 1. filter by date
  const arr = filterByDate(invoices, "createdAt");
  console.log(arr)
  // 2. sales per day (sorted oldest→newest)
  const salesDaily = Object.entries(
    arr.reduce((m, i) => {
      const d = i.createdAt.slice(0, 10);
      m[d] = (m[d] || 0) + i.amount;
      return m;
    }, {})
  )
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 3. cumulative sales
  let cum = 0;
  const salesCumulative = salesDaily.map(d => {
    cum += d.total;
    return { date: d.date, cumulative: cum };
  });

  // 4. average sale per transaction
  const avgSale = arr.reduce((s, i) => s + i.amount, 0) / (arr.length || 1);

  // 5. sales by weekday
  const byWeekday = arr.reduce((m, i) => {
    const wd = new Date(i.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    m[wd] = (m[wd] || 0) + i.amount;
    return m;
  }, {});
  const weekdayData = Object.entries(byWeekday).map(([day, total]) => ({ day, total }));

  const data = { salesDaily, salesCumulative, avgSale, weekdayData };
  const details = {
    "Gross Sales": arr.reduce((s, i) => s + i.amount, 0),
    "Transactions": arr.length,
    "Avg Sale": avgSale.toFixed(2),
    "Days Covered": salesDaily.length
  };

  return { data, details };
}
