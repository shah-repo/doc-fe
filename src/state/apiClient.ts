import axios from 'axios';
import Config from '../config';

const apiClient = axios.create({
  baseURL: Config.ApiEndpoint,
  withCredentials: true,
});

export default apiClient;
