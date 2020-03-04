import { AxiosRequestConfig, Method } from "axios";
import _, { Dictionary } from "lodash";
import { action } from "mobx";
import { useIntl } from "react-intl";
import apiClient from "../../../../state/apiClient";
import { AsyncActionErrorResponse } from "../../../../state/middlewares/api/types";
import { store } from "../../../../state/store";
import {
  ATTACH_TEMPLATE_URL,
  CANCEL_SIGNATURE_REQUEST_URL,
  CREATE_TEMPLATE_URL,
  SEND_SIGNATURE_REQUEST_URL,
} from "../../FBHelloSign/constants";
import { FBTemplateSchema } from "../../types/store";
import { FBActionModel } from "../domain/models/FBActionModel";
import FBStore from "./FBStore";
// import qs from "query-string";

const intl = useIntl();

export class FormBuilderActionStore {
  public values: Dictionary<Dictionary<any>> = {};

  @action public getActions = (): FBTemplateSchema[] => {
    return _.filter(FBStore.getSchema(), (schemaItem) => (
      schemaItem.type === "action"
    ));
  }

  @action public apiCall = async (action: Partial<FBActionModel>) => {
    const { requestUrl, requestMethod } = action;
    if (!requestUrl && !requestMethod) {
      return alert("Not enough data for sending a request");
    }
    try {
      const requestConfig: AxiosRequestConfig = {
        method: requestMethod as Method,
        url: requestUrl,
        data: action.payload || _.omit(this.values[action.name || ""], "send-email-action-supplier-field"),
        // paramsSerializer: (params) => qs.stringify(params),
        headers: {},
      };

      requestConfig.headers.Authorization = `bearer ${
        store.getState().auth.user.employeeId
      }:${store.getState().auth.user.sessionId}`;

      const { data } = await apiClient.request(requestConfig);
      if (!_.isUndefined(data)) {
        if (requestUrl === CREATE_TEMPLATE_URL) {
          return data;
        }
        if (requestUrl === SEND_SIGNATURE_REQUEST_URL) {
          return alert(intl.formatMessage({ id: "form.builder.signature.sent" }));
        }
        if (requestUrl === ATTACH_TEMPLATE_URL) {
          return alert(intl.formatMessage({ id: "form.builder.template.attached" }));
        }
        if (requestUrl === CANCEL_SIGNATURE_REQUEST_URL) {
          return alert(intl.formatMessage({ id: "form.builder.signature.cancelled" }));
        }
        alert("Success");
      }
    } catch (exception) {
      let responseMessage: string = "";
      if (exception.response) {
        const {
          data: { message },
        } = exception.response as AsyncActionErrorResponse;
        responseMessage = Array.isArray(message) ? message.join("; ") : message;
      }
      const errorMessage: string = responseMessage || exception.message;
      if (requestUrl === ATTACH_TEMPLATE_URL) {
        return alert(intl.formatMessage({ id: "form.builder.template.invalid" }));
      }
      alert(errorMessage);
    }
  }
}

const FBActionStore = new FormBuilderActionStore();
export default FBActionStore;
