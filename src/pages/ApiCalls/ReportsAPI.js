import axiosWithToken from "./axiosWithToken";



export const generateClientReport = async (newReport) => {
    console.log("generateClientReport called with:", newReport);
    try {
        console.log("Attempting to send request...");
        const response = await axiosWithToken.post('/report/generate-client-report', newReport);
        console.log("Response received:", response);
        return response.data;
    } catch (error) {
        console.error("Error in generateClientReport:", error);
        throw error;
    }
}

export const updateReportRequest =   async(id, updateLead) => {
    try {
        const response = await axiosWithToken.put(`/report/update-report/${id}`, updateLead);
        console.log('Updated lead:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating lead:', error);
        throw error;
    }
} ;


export const deleteReportRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/report/delete-report/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
    }
};


export const downloadReportPDFRequest = async (id) => {
    try {
        const response = await axiosWithToken.get(`/report/convert-to-pdf/${id}`, {
            responseType: 'blob',
        });
        return response;
    } catch (error) {
        console.error('Error downloading report:', error);
        throw error;
    }
};
