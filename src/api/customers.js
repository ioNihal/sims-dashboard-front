import callApi from "./_callApi";

export async function getAllCustomers() {
    const { data = [] } = await callApi("/api/customer");
    return data.map(c => ({ ...c, id: c._id }));
}

export async function getCustomerById(id) {
    const { data } = await callApi(`/api/customer/${id}`);
    return data;
}

export async function addCustomer(payload) {
    const { data } = await callApi("/api/customer/", {
        method: "POST",
        body: payload,
        requireAuth: false,
    });
    return data;
}

export async function updateCustomer(id, payload) {
    const { data } = await callApi(`/api/customer/${id}`, {
        method: "PATCH",
        body: payload,
    });
    return data;
}

export async function deleteCustomer(id) {
    await callApi(`/api/customer/${id}`, { method: "DELETE" });
}
