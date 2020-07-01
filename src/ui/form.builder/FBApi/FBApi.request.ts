import _ from "lodash";
import { action, observable, set } from "mobx";
import apiClient from ".";
import { ApiActionMethod } from "../../../state/types";

export default class FBRequest<Data, Body> {
  @observable public data: Data | undefined;
  @observable public body: Body | undefined;
  @observable public loading = false;
  public url = "";
  public root = "";

  public constructor(url = "") {
    this.url = url;
  }

  @action public setTemplateUrl = (url: string, values: Record<string, any>) => {
    const urlTpl = _.template(url);
    const urlStr = urlTpl(values);
    this.setUrl(urlStr);
  };

  @action public setUrl = (url: string) => {
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

  @action public dataFilter = (data: Data): Data | undefined => data;
  @action public onError = (_error) => {
    const { message } = _error;
    alert(message);
  };

  protected onSuccess() {
    this.setLoading(false);
  }

  @action private start = (method: ApiActionMethod) => {
    this.setLoading(true);
    let promise: Promise<any> | undefined;
    switch (method) {
      case "get":
        promise = apiClient().get(this.url, this.body).promise;
        break;
      case "post":
        promise = apiClient().post(this.url, this.body).promise;
        break;
      case "patch":
        promise = apiClient().patch(this.url, this.body).promise;
        break;
      default:
        return;
    }

    if (_.isUndefined(promise)) {
      return this.setLoading(false);
    }

    promise
      .then((data) => {
        !_.isEmpty(this.root) && (data = _.get(data as Data, this.root));
        data = this.dataFilter(data);
        this.setData(data as Data);
        this.onSuccess();
      })
      .catch((_error) => {
        this.setLoading(false);
        this.onError(_error);
      });

    return promise;
  };
}
