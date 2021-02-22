import { action, observable } from "mobx";

class FBApprovalAuditStore {
  @observable public data = new Map<string, any>();
  @observable public loading = new Map<string, boolean>();

  @action public setData = (documentId: string, data: any) => {
    this.data.set(documentId, data);
  };
}

export default new FBApprovalAuditStore();
