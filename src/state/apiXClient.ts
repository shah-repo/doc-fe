import axios from "axios";
import { apiClient } from "mobx-rest";
import Config from "../config";

const apiXClient = (authorization: string) => {
  const createAdapter: any = require("mobx-rest-axios-adapter").default;
  apiClient(createAdapter(axios), {
    apiPath: Config.ApiEndpoint,
    commonOptions: {
      headers: {
        Authorization: authorization,
      },
    },
  });
};

export default apiXClient;
