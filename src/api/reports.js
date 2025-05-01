// src/api/report.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";



/**
 * Fetches all reports from the server.
 *
 * @async
 * @function fetchReports
 * @returns {Promise<Object[]>} Resolves to an array of report objects.
 * @throws {Error} If the network request fails or returns a non-OK status.
 */
export async function fetchReports() {
    const url = `${BASE_URL}/report`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error?.message || `Failed to fetch reports (status: ${res.status})`);
    }
    return data.reports;
}




/**
 * Fetch a single report by ID from the server.
 *
 * @param {string} id  - Report _id
 * @returns {Promise<Object>}  The report object
 * @throws {Error} if the fetch fails or report not found
 */
async function getReportById(id) {
    const res = await fetch(`https://suims.vercel.app/api/report/${encodeURIComponent(id)}`);
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || `Failed to fetch report (status ${res.status})`);
    }
    return json.report || json.reports?.[0];
}





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




/**
 * Deletes a single report by its ID.
 *
 * @async
 * @function deleteReport
 * @param {string} id - The unique identifier of the report to delete.
 * @returns {Promise<void>} Resolves when the delete operation completes.
 * @throws {Error} If the network request fails or returns a non-OK status.
 */
export async function deleteReport(id) {
    const url = `${BASE_URL}/report/${encodeURIComponent(id)}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || `Failed to delete report (status: ${res.status})`);
    }
}