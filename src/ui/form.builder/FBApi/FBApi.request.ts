import { first, get, has, isArray, isEmpty, isString, isUndefined, join, template } from "lodash";
import { action, observable, set } from "mobx";
import { apiClient, FBRequestSet, FBRequestTemplateUrl } from "..";
import { store } from "../../../state/store";
import { ApiActionMethod } from "../../../state/types";
import { toastError } from "../../components/notifications";

export default class FBRequest<Data, Body> {
  @observable public data: Data | undefined;
  @observable public body: Body & { password?: string } | undefined;
  @observable public loading = false;
  public method?: ApiActionMethod;
  public url = "";
  public root = "";

  public constructor(url = "") {
    this.url = url;
  }

  private setTemplateUrl = (config: Record<string, any> | FBRequestTemplateUrl) => {
    let url = this.url;
    let values = config;
    if (has(config, "values")) {
      url = config.url;
      values = config.values;
    }
    const urlTpl = template(url);
    const urlStr = urlTpl(values);
    this.setUrl(urlStr);
  };

  public setUrl = (url: string | Record<string, any> | FBRequestTemplateUrl) => {
    if (!isString(url)) {
      return this.setTemplateUrl(url);
    }
    set(this, "url", url);
  };

  @action public setLoading = (state: boolean) => {
    set(this, "loading", state);
  };

  @action public setData = (data: Data) => {
    set(this, "data", data);
  };

  @action public setBody = (body: Body) => {
    set(this, "body", body);
  };

  @action public setRoot = (root: string) => {
    set(this, "root", root);
  };

  @action public fetch = () => this.start("get");
  @action public post = () => this.start("post");
  @action public patch = () => this.start("patch");
  @action public delete = () => this.start("delete");

  @action public prepareData = (data: Data): Data | undefined => data;

  public set = (set: FBRequestSet<Body>) => {
    const { url, urlValues, body, method } = set;
    url && this.setUrl(url);
    urlValues && this.setUrl(urlValues);
    body && this.setBody(body);
    method && this.start(method);
  };

  protected onSuccess() {
    this.setLoading(false);
  }

  protected onError(error) {
    let { message } = error;
    if (isArray(message) && has(first(message), "message")) {
      message = join(get(first(message), "message"), "\n");
    } else {
      message = Array.isArray(message) ? message.join("; ") : message;
    }
    toastError(message);
  }

  @action private start = (method: ApiActionMethod) => {
    this.setLoading(true);
    let promise: Promise<any> | undefined;

    const headers = this.body?.password ? {
      Authorization: `bearer_password ${
        store.getState().auth.user.employeeId
      }:${store.getState().auth.user.sessionId}:${this.body?.password}`,
    } : undefined;

    switch (method) {
      case "get":
        this.method = "get";
        promise = apiClient().get(this.url, this.body).promise;
        break;
      case "post":
        this.method = "post";
        promise = apiClient().post(this.url, this.body, { headers }).promise;
        break;
      case "patch":
        this.method = "patch";
        promise = apiClient().patch(this.url, this.body).promise;
        break;
      case "delete":
        this.method = "delete";
        promise = apiClient().del(this.url, this.body).promise;
        break;
      default:
        return;
    }

    if (isUndefined(promise)) {
      return this.setLoading(false);
    }

    promise
      .then((data) => {
        !isEmpty(this.root) && (data = get(data as Data, this.root));
        data = this.prepareData(data);
        this.setData(data as Data);
        this.onSuccess();
      })
      .catch((_error) => {
        this.onError(_error);
        this.setLoading(false);
      });

    return promise;
  };
}
