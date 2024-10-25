import axios from 'axios';
import Config from '../../../config';
import { store } from '../../../state/store';

// Create an Axios instance with base URL and default headers
const axiosApi = axios.create({
  baseURL: Config.ApiEndpoint,
  headers: {
    get Authorization() {
      const { employeeId, sessionId } = store.getState().auth.user;
      return `bearer ${employeeId}:${sessionId}`;
    },
  },
});

export default axiosApi;
