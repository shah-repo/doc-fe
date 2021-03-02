import { action, observable, set } from "mobx";
import { FBHelloSignPayload } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBHelloSignState {
  @observable public waitOverlay = false;
  @observable public signatureSent = false;
  public loadingMessage = "";
  public createTemplateApi= new FBRequest<null, FBHelloSignPayload>(FBEndpoint.CreateTemplateUrl);
  public sendSignatureApi = new FBRequest<null, FBHelloSignPayload>(FBEndpoint.SendSignatureUrl);
  public cancelSignatureApi = new FBRequest<null, FBHelloSignPayload>(FBEndpoint.CancelSignatureUrl);

  @action public setOverlay = (waitOverlay: boolean) => {
    set(this, "waitOverlay", waitOverlay);
  };

  @action public setLoadingMessage = (loadingMessage: string) => {
    set(this, "loadingMessage", loadingMessage);
  };

  @action public setSignatureStatus = (signatureSent: boolean) => {
    set(this, "signatureSent", signatureSent);
  };

  public setBody = (body: FBHelloSignPayload) => {
    this.createTemplateApi.setBody(body);
    this.sendSignatureApi.setBody(body);
    this.cancelSignatureApi.setBody(body);
  };
}

export default FBHelloSignState;
