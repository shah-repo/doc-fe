import { action, computed, observable, set } from "mobx";
import { FBApprovalMatrixFieldData, FBAuditData } from "..";
import { Approval } from "../../../state/ducks/common/types";
import { SidebarType } from "../../documentRevision/Sidebar/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

// TODO: check with Z. Babic if we can avoid global store for reload
// needs such as audit
class FBStore {
  @observable public audit = new FBRequest<FBAuditData[], null>(FBEndpoint.DocumentRevisionAudit);
  @observable public selectedTab: SidebarType | undefined;
  public revChangeBeforeApprovals;
  @observable purchaseOrderValue;
  public damData?: FBApprovalMatrixFieldData ={
    approvalRoles: [],
    approvalMatrix: [],
  };
  public selectedApprover: Approval[] =[] ;

  @computed public get isHistoryTabSelected() {
    return this.selectedTab === "history";
  }
  @action public setSelectedTab = (tab) => {
    set(this, "selectedTab", tab);
  };
  @action public setPurchaseOrderValue = (value) => {
    set(this, "purchaseOrderValue", value);
  };

  @computed public get getSelectedTab() { return this.selectedTab; }
}

export default new FBStore();
