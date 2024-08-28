import axios from 'axios';
import Cookies from 'js-cookie';

const axiosWithToken = axios.create({
    baseURL: 'https://store-management-backend-ckhzcpd6cyczfped.eastus-01.azurewebsites.net/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosWithToken.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosWithToken;
