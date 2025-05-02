
const BASE_URL = "https://suims.vercel.app/api/supplier";

/**
 * Fetches the list of suppliers.
 * @returns {Promise<Array>} array of supplier objects
 * @throws on network or parsing error
 */
export async function getSuppliers() {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) {
        throw new Error(`Failed to fetch suppliers (${res.status})`);
    }
    const data = await res.json();
    return data.supplier || data;
}

/**
 * Fetches one supplier by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getSupplier(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
        if (res.status === 404) throw new Error("Supplier not found");
        throw new Error(`Failed to fetch supplier (${res.status})`);
    }
    const data = await res.json();
    return data.supplier || data;
}

/**
 * Creates a new supplier.
 * @param {Object} supplierData
 * @returns {Promise<Object>} the created supplier
 */
export async function createSupplier(supplierData) {
    const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = body.error?.message || body.message || `Failed to add supplier (${res.status})`;
        throw new Error(msg);
    }
    return body;
}

/**
 * Partially update a supplier.
 * @param {string} id
 * @param {object} payload
 */
export async function updateSupplier(id, payload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = body.error?.message || body.message || `Failed to update (${res.status})`;
        throw new Error(msg);
    }
    return body;
}

/**
 * Deletes a supplier by ID.
 * @param {string} id 
 * @returns {Promise<void>}
 * @throws on network error or non-2xx response
 */
export async function deleteSupplier(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
        let msg = `Failed to delete supplier (${res.status})`;
        try {
            const body = await res.json();
            msg = body.error?.message || msg;
        } catch { }
        throw new Error(msg);
    }
}
