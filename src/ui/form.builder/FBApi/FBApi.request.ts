import { action, observable, set } from "mobx";
import apiClient from ".";

export default class FBRequest {
  @observable public data: any = [];
  @observable public loading: boolean = false;
  public url: string = "";

  @action public setLoading = (state: boolean) => {
    set(this, "loading", state);
  }

  @action public setData = (data: any[]) => {
    set(this, "data", data);
  }

  @action public fetch = () => {
    this.setLoading(true);
    const { promise } = apiClient().get(this.url);
    promise
      .then((data) => {
        this.setData(data);
        this.setLoading(false);
        this.onDataLoaded();
      })
      .catch((_error) => {
        this.setLoading(false);
      });
  }

  @action public onDataLoaded = () => {}
}
