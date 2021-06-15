import { first, get, has, isArray, isEmpty, isUndefined, join, template } from "lodash";
import { action, observable, set } from "mobx";
import { smStoreClient, SMStoreError, SMStorePassword, SMStoreProps, SMStoreRequestMethod, SMStoreRequestSet, storeClient } from "../../..";
import { store } from "../../../../state/store";
import { toastError } from "../../../../ui/components/notifications";

class SMStore implements SMStoreProps {
  // MARK: @config

  // MARK: @observables
  @observable public data = new Map<string, any>();
  @observable public loading = new Map<string, boolean>();

  // // MARK: @actions
  @action public setData = <Data>(url: string, data: Data) => {
    if (isArray(data)) {
      this.data.set(url, observable.map(
        (data as Data[]).map((rec: Data) => [get(rec, "id"), rec]),
        { deep: false }
      ));
    } else {
      if (JSON.stringify(this.data.get(url)) === JSON.stringify(data)) {
        return;
      }
      set(this.data, url, data);
    }
  };

  public templateUrl = (url: string, values: Record<string, any>): string => {
    const urlTpl = template(url);
    return urlTpl(values);
  };

  public get = <Data, Body>(
    set: SMStoreRequestSet<Body>,
    callback?: (data?: Data, error?: SMStoreError) => any
  ) => this.start<Data, Body>("get", set, callback);

  public post = <Data, Body>(
    set: SMStoreRequestSet<Body>,
    callback?: (data?: Data, error?: SMStoreError) => any
  ) => this.start<Data, Body>("post", set, callback);

  private start = <Data, Body>(
    method: SMStoreRequestMethod,
    set: SMStoreRequestSet<Body>,
    callback?: (data?: Data, error?: SMStoreError) => any
  ) => {
    const { url, body, mapping = "" } = set;

    if (!url || isEmpty(url)) {
      return toastError("SMStore Error: Missing url in api call!");
    }

    // If data is loading
    if (this.loading.get(url)) {
      return;
    }
    this.loading.set(url, true);
    let authorization = "";
    const { password } = (body as SMStorePassword) || {};
    const { employeeId, sessionId } = store.getState().auth.user;

    if (password) {
      authorization = `bearer_password ${employeeId}:${sessionId}:${password}`;
    } else {
      authorization = `bearer ${employeeId}:${sessionId}`;
    }

    storeClient(authorization);
    const apiClient = smStoreClient();

    const request: Record<SMStoreRequestMethod, () => Promise<any>> = {
      get: () => apiClient.get(url, body).promise,
      post: () => apiClient.post(url, body).promise,
      patch: () => apiClient.patch(url, body).promise,
      delete: () => apiClient.del(url, body).promise,
    };

    const promise = request[method]();

    if (isUndefined(promise)) {
      return this.loading.set(url, false);
    }

    promise
      .then((data) => {
        !isEmpty(mapping) && (data = get(data as Response, mapping));
        if (callback) {
          callback(data);
        } else {
          this.setData<Data>(url, data as Data);
        }
        this.loading.set(url, false);
      })
      .catch((error) => {
        let { message } = error;
        const { statusCode } = error;
        if (isArray(message) && has(first(message), "message")) {
          message = join(get(first(message), "message"), "\n");
        } else {
          message = Array.isArray(message) ? message.join("; ") : message;
        }
        this.loading.set(url, false);
        if (callback) {
          return callback(undefined, {
            statusCode,
            message,
          });
        }
        toastError(message);
      });

    return promise;
  };
}

export default new SMStore();

