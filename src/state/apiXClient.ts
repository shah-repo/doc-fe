import axios from "axios";
import Config from "../config";
import apiClient from "../ui/form.builder/FBApi/FBApi.client";

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
