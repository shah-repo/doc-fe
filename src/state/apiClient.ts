import axios from "axios";
import { SessionTimeoutService } from "../common/utils/sessionTimeout";
import Config from "../config";

const sessionService = SessionTimeoutService.getInstance();

const apiClient = axios.create({
  baseURL: Config.ApiEndpoint,
});

apiClient.interceptors.request.use((request) => {
  sessionService.resetSessionTimer();
  return request;
});

export default apiClient;
