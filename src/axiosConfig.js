import axios from 'axios';

/* const axiosInstance = axios.create({
    baseURL: 'http://localhost:2000',
}); */

const axiosInstance = axios.create({
    baseURL: 'https://uia-api-36e17f58f26b.herokuapp.com/',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const noAuthUrls = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/refresh-token'];
        if (!noAuthUrls.includes(config.url)) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axiosInstance.post('/api/auth/refresh-token', null, {
                    params: { refreshToken },
                });
                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Refresh token failed:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
