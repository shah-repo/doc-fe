import axios from 'axios';
import Config from '../config';

const apiClient = axios.create({
  baseURL: Config.ApiEndpoint,
  withCredentials: true,
});

export const externalClient = axios.create({
  withCredentials: false,
});

export default apiClient;
