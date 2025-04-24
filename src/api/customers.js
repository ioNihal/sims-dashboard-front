

const BASE_URL = "https://suims.vercel.app/api/customer";

/**
 * Fetches all customers from the server.
 *
 * @async
 * @function getAllCustomers
 * @returns {Promise<Array<Object>>} Resolves to an array of customer objects,
 * each normalized with an `id` field.
 * @throws {Error} Throws if the network request fails or returns a non-OK status.
 */
export async function getAllCustomers() {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) {
        throw new Error(`Failed to fetch customers (status: ${res.status})`);
    }
    const data = await res.json();
    const list = data.data || data;
    return list.map(cust => ({ ...cust, id: cust._id }));
}


/**
 * Fetch customer data by ID.
 *
 * @async
 * @function getCustomerById
 * @param {string} id - The unique identifier of the customer.
 * @returns {Promise<Object>} The customer data object.
 * @throws Will throw an error if the fetch fails or response is not ok.
 */
export const getCustomerById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch customer data");
    }
    const data = await res.json();
    return data.data || data;
};



/**
 * Creates a new customer.
 *
 * @async
 * @function addCustomer
 * @param {Object} customerData
 * @param {string} customerData.name     – Customer’s full name
 * @param {string} customerData.email    – Customer’s email address
 * @param {string} customerData.phone    – Customer’s phone number
 * @param {string} customerData.address  – Customer’s postal address
 * @param {string} customerData.paymentPreference  – Customer’s Payment preferences (weely or , monthly)
 * @param {string} customerData.password – Auto‑generated password
 * @returns {Promise<Object>}            Resolves to the created customer object
 * @throws {Error}                       Throws if the network request fails or returns non‑OK
 */
export async function addCustomer({ name, email, phone, address, paymentPreference, password }) {
    const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, paymentPreference, password })
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || `Failed to add customer (status: ${res.status})`);
    }
    return json;
}


/**
 * Update a customer's information.
 *
 * @async
 * @function updateCustomer
 * @param {string} id - The unique identifier of the customer to update.
 * @param {Object} customerData - The updated customer data.
 * @param {string} customerData.name - Customer's full name.
 * @param {string} customerData.email - Customer's email address.
 * @param {string} customerData.phone - Customer's phone number.
 * @param {string} customerData.address - Customer's address.
 * @param {string} customerData.paymentPreference  – Customer’s Payment preferences (weely or , monthly)
 * @returns {Promise<Object>} The result of the update operation.
 * @throws Will throw an error if the update fails or response is not ok.
 */
export const updateCustomer = async (id, customerData) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || "Failed to update customer");
    }

    return result;
};


/**
 * Deletes a single customer by its ID.
 *
 * @async
 * @function deleteCustomer
 * @param {string} id – The `_id` of the customer to delete.
 * @returns {Promise<void>} Resolves when deletion is successful.
 * @throws {Error} Throws if the network request fails or returns a non-OK status.
 */
export async function deleteCustomer(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
        throw new Error(`Failed to delete customer id=${id} (status: ${res.status})`);
    }
}
