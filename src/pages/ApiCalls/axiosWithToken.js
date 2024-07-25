import axios from 'axios';
import Cookies from 'js-cookie';

const axiosWithToken = axios.create({

    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosWithToken.interceptors.request.use(
    (config) => {
        console.log('IM IN AXIOS WITH TOLEN ');
        const token = Cookies.get('accessToken');
         console.log('Adding token to headers:', token);
         config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header after:', config.headers.Authorization);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosWithToken;