import { action } from "mobx";
import { FBApprovalAuditConstructor, FBAuditData, FBAutocompleteAsyncState, FBInputType } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import FBStore from "../FBStore/FBStore";

class FBApprovalAuditState extends FBRequest<FBAuditData[], any> {

  public static omitAudit: FBInputType[] = [
    "instructionsdocument",
    "selectdocument",
    "autocompleteasync",
    "poreceive",
    "evidencemediaupload",
    "instructionsdocument",
    "testRequirement",
    "selectrequirement",
    "hellosign",
    "approvalMatrix",
    "poApprovalMatrix",
  ];

  public static docAudit: FBInputType[] = [
    "number",
    "textfield",
    "checkbox",
    "checkboxgroup",
    "datepicker",
    "texteditor",
    "select",
    "radio",
    "radiogroup",
    "autocomplete",
    "autocompleteasync",
    "fileupload",
    "quantity",
    "procedure",
    "mpiprocedure",
  ];

  public autocompleteApi = new FBAutocompleteAsyncState();

  public constructor({ documentId, isOutput }: FBApprovalAuditConstructor) {
    super();
    if (!documentId || !isOutput || FBStore.audit.loading) { return; }
    FBStore.audit.set({
      url: FBEndpoint.DocumentRevisionAudit,
      urlValues: { documentId },
      method: "get",
    });
  }

  public setAutocompleteOptionId = (optionId) => {
    this.autocompleteApi.setOptionId(optionId);
  };

  @action public refresh = () => {
    FBStore.audit.fetch();
  };
}

export default FBApprovalAuditState;

