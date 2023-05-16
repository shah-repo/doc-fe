import axios from 'axios';
import Config from '../config';

const apiClient = axios.create({
  baseURL: Config.ApiEndpoint,
});

export default apiClient;
