import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://storemanagement-hce0c0cqddagapcw.eastus-01.azurewebsites.net/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
