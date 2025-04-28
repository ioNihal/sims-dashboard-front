/**
 * Send a PATCH request to update admin details.
 *
 * @param {UpdateAdminPayload} payload
 * @returns {Promise<{ message: string, success: boolean, statusCode: number }>}
 * @throws {Error} Throws if the network request fails or the response is not ok.
 */
export async function updateAdmin(payload) {
    const res = await fetch('https://suims.vercel.app/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update admin');
    }

    return res.json();
}
