import { action, observable, set } from "mobx";

export class FBHelloSignState {
  @observable public waitOverlay: boolean = false;
  @observable public loadingMessage: string = "";

  @action public setOverlay = (waitOverlay: boolean) => {
    set(this, "waitOverlay", waitOverlay);
  }

  @action public setLoadingMessage = (loadingMessage: string) => {
    set(this, "loadingMessage", loadingMessage);
  }
}

export default FBHelloSignState;
