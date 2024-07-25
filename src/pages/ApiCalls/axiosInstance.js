import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/collaborators/',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

axiosInstance.interceptors.request.use((config) => {
    console.log('Before:', config.headers);
    delete config.headers.Authorization;
    console.log('After:', config.headers);
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default axiosInstance;