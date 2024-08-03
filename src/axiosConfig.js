import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://uia-api-36e17f58f26b.herokuapp.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
