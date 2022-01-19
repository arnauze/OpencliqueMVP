import axios from 'axios';
import { getApiEndpoint } from '../../modules/utills';

const apiHeaders = {
  method: 'PUT,DELETE,POST,GET,OPTION',
  headers: {
    accept: 'application/json',
  },
};

export const getApi = (url, params) => {
  return axios.get(getApiEndpoint() + url, apiHeaders);
};

export const postApi = (url, apiData) => {
  return axios.post(`${getApiEndpoint()}${url}`, apiData, apiHeaders);
};

export const putApi = (url, apiData) => {
  return axios.put(`${getApiEndpoint()}${url}`, apiData, apiHeaders);
};

export const deleteApi = url => {
  return axios.delete(`${getApiEndpoint()}${url}`, apiHeaders);
};

export const setupInterceptors = store => {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response && [401].includes(error?.response?.status)) {
        // store.dispatch(fetchLoginSuccess(null));
      }

      return Promise.reject(error);
    },
  );
};
