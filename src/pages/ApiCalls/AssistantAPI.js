import axiosWithToken from "./axiosWithToken";

export const uploadFileRequest = async (formData) => {
    try {
        const response = await axiosWithToken.post('/files/upload-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Upload File:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
export const downloadFileRequest = async (id) => {
    try {
        const response = await axiosWithToken.get(`/files/download-file/${id}`, {
            responseType: 'blob',
        });
        console.log('File downloaded successfully:', response);
        return response.data;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

