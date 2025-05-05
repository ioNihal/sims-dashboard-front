import callApi from "./_callApi";

export async function getAllFeedbacks() {
    const { feedbacks } = await callApi("/api/feedback/");
    return feedbacks;
}

export async function deleteFeedbackById(id) {
    await callApi(`/api/feedback/${id}`, { method: "DELETE", });
}
