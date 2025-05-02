

const BASE_URL = "https://suims.vercel.app/api/inventory";

/**
 * Fetches all inventory items from the server.
 *
 * @async
 * @function getAllInventoryItems
 * @returns {Promise<Array<Object>>} Resolves to an array of inventory item objects.
 * @throws {Error} Throws if the network request fails or returns a non-OK status.
 */
export async function getAllInventoryItems() {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) {
        throw new Error(`Failed to fetch inventory items (status: ${res.status})`);
    }
    const data = await res.json();
    return data.inventory || [];
}



/**
 * Fetches a single inventory item by its ID.
 *
 * @async
 * @function getInventoryItemById
 * @param {string} id – the `_id` of the inventory item
 * @returns {Promise<Object>} Resolves to the inventory item object
 * @throws {Error} Throws if the network request fails or returns non‐OK
 */
export async function getInventoryItemById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch item id=${id} (status: ${res.status})`);
    }
    const data = await res.json();
    // assume API returns { inventory: { … } }
    return data.inventory;
}




/**
 * Posts a new inventory item to the server.
 *
 * @async
 * @function addInventoryItem
 * @param {Object} payload
 * @param {string} payload.supplierId   – the _id of the supplier
 * @param {string} payload.productId    – the _id of the product
 * @param {number} payload.quantity     – number of units to add
 * @param {number} payload.threshold    – low‐stock threshold
 * @returns {Promise<Object>}           Resolves to the created inventory object
 * @throws {Error}                      Throws if the network request fails or returns non‐OK
 */
export async function addInventoryItem({ supplierId, productId, quantity, threshold }) {
    const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId, productId, quantity, threshold })
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error?.message || `Failed to add inventory (status: ${res.status})`);
    }
    return json;  // assume API returns created item or success message
}


/**
* Updates quantity and threshold of an existing inventory item.
*
* @async
* @function updateInventoryItem
* @param {string} id – the `_id` of the inventory item
* @param {Object} updates
* @param {number} updates.quantity  – new quantity
* @param {number} updates.threshold – new low-stock threshold
* @returns {Promise<Object>} Resolves to the updated inventory object
* @throws {Error} Throws if the network request fails or returns non‐OK
*/
export async function updateInventoryItem(id, { quantity, threshold }) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, threshold })
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error?.message || `Failed to update item id=${id} (status: ${res.status})`);
    }
    return json;
}


/**
 * Deletes a single inventory item by its ID.
 *
 * @async
 * @function deleteInventoryItem
 * @param {string} id - The `_id` of the inventory item to delete.
 * @returns {Promise<void>} Resolves when deletion is successful.
 * @throws {Error} Throws if the network request fails or returns a non-OK status.
 */
export async function deleteInventoryItem(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error(`Failed to delete item with id=${id} (status: ${res.status})`);
    }
}
