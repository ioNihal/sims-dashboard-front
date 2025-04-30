// src/api/report.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";













/**
 * Send a new report to the API.
 * @async
 * @function createReport
 * @param {ReportPayload} payload
 * @param {string} payload.name             – The report’s name
 * @param {string} payload.type             – Report type (must match enum)
 * @param {string} [payload.description]    – Optional description
 * @param {{start:string,end:string}} payload.dateRange
 * @param {Array} payload.chartData         – Chart series array
 * @param {Object} payload.dataDetails      – Summary details object
 * @returns {Promise<void>}  
 * @throws Will throw if the network request fails or the response is not ok.
 */
export async function createReport(payload) {
    const res = await fetch(`${BASE_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || "Report save failed");
    }
}
