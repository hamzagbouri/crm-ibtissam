import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://backend-ibtissam.infinityfreeapp.com/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
