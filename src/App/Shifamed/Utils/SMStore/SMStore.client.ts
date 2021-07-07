import axios from "axios";
import { SMStoreAdapter } from "../../..";
import Config from "../../../../config";


let currentAdapter: any;

/**
 * Sets or gets the api client instance
 */
export function smStoreClient(
  adapter?: SMStoreAdapter,
  options: { [key: string]: any } = {},
): SMStoreAdapter {
  if (adapter) {
    currentAdapter = Object.assign({}, adapter, options);
  }

  if (!currentAdapter) {
    throw new Error("You must set an adapter first!");
  }

  return currentAdapter;
}


export const storeClient = (authorization: string) => {
  const createAdapter: any = require("mobx-rest-axios-adapter").default;
  smStoreClient(createAdapter(axios), {
    apiPath: Config.ApiEndpoint,
    commonOptions: {
      headers: {
        Authorization: authorization,
      },
    },
  });
};
