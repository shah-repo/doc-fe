import axios from "axios";
import { apiClient as MobxApiClient } from "mobx-rest";
import Config from "../config";

const mobxApiClient = (authorization: string) => {
  const createAdapter: any = require("mobx-rest-axios-adapter").default;
  MobxApiClient(createAdapter(axios), {
    apiPath: Config.ApiEndpoint,
    commonOptions: {
      headers: {
        Authorization: authorization,
      },
    },
  });
};

export default mobxApiClient;
