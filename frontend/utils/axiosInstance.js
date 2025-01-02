import axios from 'axios';
import { getAuthToken } from './auth.js';
import deleteCookie from './deleteCookie.js';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', 
  // headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    const token = getAuthToken(); 
    if (!token) {
        window.location.href = 'http://localhost:5173/login/201';
    }
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
      return response;
    },
    function (error) {
      // Handle the response error
      console.log(error);
      
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        console.error('Unauthorized, logging out...');
        // Perform any logout actions or redirect to login page
        try {
            deleteCookie();
            setTimeout(() => {
              window.location.href = 'http://localhost:5173/login/201';            
            }, 1500);
        } catch (error) {
            console.error("couldn't log user out", error);
        }
      }
      return Promise.reject(error);
    }
);


export default axiosInstance;