import callApi from "./_callApi";

export async function updateAdmin(payload) {
  const result = await callApi("/api/admin", {
    method: "PATCH",
    body: payload,
    requireAuth: false,
  });
  return result;
}
