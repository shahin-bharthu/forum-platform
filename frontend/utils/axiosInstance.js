import axios from 'axios';
import { getAuthToken } from './auth.js';
import { setLoading } from '../src/store/loaderSlice.js';
import { store } from '../src/store/index.js';

let activeRequests = 0;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', 
  // headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {    
    // Do something before the request is sent
    activeRequests++;

    const token = getAuthToken(); 
    if (!token) {
        window.location.href = 'http://localhost:5173/login/201';
        // return config;
    }

    const fullState = store.getState();
    const isLoading = fullState.loading.isLoading;

    if (activeRequests == 1 && !isLoading) {
      store.dispatch(setLoading(true));
    }
    return config;
  },
  function (error) {
    activeRequests--;
    if (activeRequests == 0) {
      store.dispatch(setLoading(false))
    }
    console.log("req int err:", error);
    return Promise.reject(error);
  }
);
				

axiosInstance.interceptors.response.use(
    function (response) {
      // Do something with the response data
      // console.log('Response:', response);
      activeRequests--;
      if (activeRequests == 0) {
        store.dispatch(setLoading(false));
      }
      return response;
    },
    function (error) {
      // Handle the response error
      activeRequests--;
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        console.error('Unauthorized, logging out...');
        // Perform any logout actions or redirect to login page
      }
      if (activeRequests == 0) {
        store.dispatch(setLoading(false));
      }
      return Promise.reject(error);
    }
);


export default axiosInstance;