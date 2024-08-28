import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://store-management-backend-ckhzcpd6cyczfped.eastus-01.azurewebsites.net',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
