// src/api/feedbacks.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetch all feedbacks
 * @returns {Promise<Array>} array of feedback objects
 */
export async function getAllFeedbacks() {
    const res = await fetch(`${API_BASE}/api/feedback/`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch feedbacks');
    }
    const data = await res.json();
    return data.feedbacks;
}



/**
 * Delete one feedback by id
 * @param {string} id 
 * @returns {Promise<void>}
 */
export async function deleteFeedbackById(id) {
    const res = await fetch(`${API_BASE}/api/feedback/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete feedback');
    }
}
