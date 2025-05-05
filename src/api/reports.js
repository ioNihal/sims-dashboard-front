import callApi from "./_callApi";

export async function fetchReports() {
    const { reports } = await callApi("/api/report");
    return reports;
}

export async function getReportById(id) {
    const { report } = await callApi(`/api/report/${encodeURIComponent(id)}`);
    return report;
}

export async function createReport(payload) {
    await callApi("/api/report", { method: "POST", body: payload, });
}

export async function deleteReport(id) {
    await callApi(`/api/report/${encodeURIComponent(id)}`, { method: "DELETE" });
}
