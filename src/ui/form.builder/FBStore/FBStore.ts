import { action, observable, set } from "mobx";
import { FBAuditData } from "..";
import { SidebarType } from "../../documentRevision/Sidebar/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

// TODO: check with Z. Babic if we can avoid global store for reload
// needs such as audit
class FBStore {
  @observable public audit = new FBRequest<FBAuditData[], null>(FBEndpoint.DocumentRevisionAudit);
  @observable public selectedTab: SidebarType | undefined;
  @action public getIsHistoryTabSelected = () =>
    this.selectedTab === "history"
  ;
  @action public setSelectedTab = (tab) => {
    set(this, "selectedTab", tab);
  };
  @action public getSelectedTab = () => this.selectedTab;
}

export default new FBStore();
