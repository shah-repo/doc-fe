import axios from "axios";
import Config from "../config";
import apiClient from "../ui/form.builder/FBApi/FBApi.client";

const apiXClient = (authorization: string, isApiPublic?: boolean) => {
  const createAdapter: any = require("mobx-rest-axios-adapter").default;
  apiClient(
    createAdapter(axios), {
      apiPath: isApiPublic ? Config.PublicUrl : Config.ApiEndpoint,
      commonOptions: {
        headers: {
          Authorization: isApiPublic ? "" : authorization,
        },
      },
    });
};

export default apiXClient;
