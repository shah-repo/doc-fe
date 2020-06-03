import { action } from "mobx";
import { FBApprovalAuditConstructor, FBAuditData, FBAutocompleteAsyncState } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import FBStore from "../FBStore/FBStore";

export class FBApprovalAuditState extends FBRequest<FBAuditData[], any> {

  public autocompleteApi = new FBAutocompleteAsyncState();

  public constructor({ documentId, isOutput }: FBApprovalAuditConstructor) {
    super();
    if (!documentId || !isOutput || FBStore.audit.loading) { return; }
    FBStore.audit.setTemplateUrl(FBEndpoint.DocumentRevisionAudit, { documentId });
    FBStore.audit.fetch();
  }

  public setAutocompleteOptionId = (optionId) => {
    this.autocompleteApi.setOptionId(optionId);
  };

  @action public refresh = () => {
    FBStore.audit.fetch();
  };

  protected onSuccess() {
    super.onSuccess();
  }
}

export default FBApprovalAuditState;

