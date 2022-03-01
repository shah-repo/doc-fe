import { action, observable, set } from "mobx";
import { FBAuditData } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

// TODO: check with Z. Babic if we can avoid global store for reload
// needs such as audit
class FBStore {
  @observable public audit = new FBRequest<FBAuditData[], null>(FBEndpoint.DocumentRevisionAudit);
  @observable public isHistoryTabSelected: boolean | undefined;
  @action public setIsHistoryTabSelected = (flag) => {
    set(this, "isHistoryTabSelected", flag);
  };
  @action public getIsHistoryTabSelected = () => this.isHistoryTabSelected;
}

export default new FBStore();
