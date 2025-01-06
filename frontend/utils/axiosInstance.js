import axios from 'axios';
import { getAuthToken } from './auth.js';
import { setLoading } from '../src/Store/loaderSlice.js';
import { store } from '../src/Store/Index.js';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', 
  // headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    const token = getAuthToken(); 
    if (!token) {
        window.location.href = 'http://localhost:5173/login/201';
    }
    store.dispatch(setLoading(true));
    return config;
  },
  function (error) {
    console.log("req int err:", error);
    return Promise.reject(error);
  }
);
				

axiosInstance.interceptors.response.use(
    function (response) {
      // Do something with the response data
      // console.log('Response:', response);
      store.dispatch(setLoading(false));
      return response;
    },
    function (error) {
      // Handle the response error
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        console.error('Unauthorized, logging out...');
        // Perform any logout actions or redirect to login page
      }
      store.dispatch(setLoading(false));
      return Promise.reject(error);
    }
);


export default axiosInstance;