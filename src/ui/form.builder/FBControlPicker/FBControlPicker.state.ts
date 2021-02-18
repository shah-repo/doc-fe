import { find } from "lodash";
import React from "react";
import { FBControlPickerDataProps, FBInputType, FBWorkspaceExternalState, FBWorkspaceState } from "..";
import { GroupTag } from "../../../state/ducks/auth/types";
import { store } from "../../../state/store";
import { checkIsDocumentEquipment } from "../../documentRevision/helpers/checkDocumentGroup";
import { FBEditorCustomControl } from "../FBEditorCustomControl";

export class FBControlPickerState {

  public customPicker: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    customcontrol: FBEditorCustomControl,
  };

  private workspaceState?: FBWorkspaceState;

  public constructor(workspaceState?: FBWorkspaceState) {
    this.workspaceState = workspaceState;
  }

  public picker = (picker: FBInputType, index: number): React.ReactElement | undefined => {
    const customPicker = this.customPicker[picker];
    if (!customPicker) {
      return;
    }
    return React.createElement(customPicker, { index });
  };

  public get pickers(): FBControlPickerDataProps {

    const isEQ = checkIsDocumentEquipment(
      this.workspaceState?.document?.document?.documentType?.groupOptions);
    if (isEQ) {
      return {
        inputs: [
          ...this.hasEquipmentMaintenance ? ["eqmaintenance"] as FBInputType[] : [],
        ],
      };
    }
    return {
      section: ["section", "subsection", "stepsection", "teststep"],
      inputs: [
        "textfield",
        "checkboxgroup",
        "autocomplete",
        "texteditor",
        "datepicker",
        "hyperlink",
        "select",
        "radiogroup",
        "paragraph",
        "fileupload",
        "blanktplform",
        "quantity",
        "timer",
        ...this.hasPurchaseOrder ? ["purchaseorder"] as FBInputType[] : [],
        ...this.hasRecPurchaseOrder ? ["poreceive"] as FBInputType[] : [],
        ...!this.hasApprovalMatrix ? ["approvalMatrix"] as FBInputType[] : [],
        "poApprovalMatrix",
        "instructionsmediaupload",
        "evidencemediaupload",
        "testRequirement",
        "procedure",
        "mpiprocedure",
        ...this.hasEquipmentMaintenance ? ["eqmaintenance"] as FBInputType[] : [],
        "textfieldwithrange",
        "supplier",
      ],
      approvals: [
        "approvals",
        ...this.hasHelloSign ? ["hellosign"] as FBInputType[] : [],
        ...this.hasApproval ? ["inlineapproval"] as FBInputType[] : [],
        ...this.hasRequestApproval ? ["requestapproval"] as FBInputType[] : [],
      ],
      customcontrols: ["customcontrol"],
      instructions: ["instructionsdocument", "selectdocument", "selectrequirement"],
      buttons: ["checkpoint", "createlabel", "task"],
      actions: ["action"],
    };
  }

  private get hasHelloSign(): boolean | undefined {
    const { company } = (store.getState() || {}) as FBWorkspaceExternalState;
    return company?.companyMine.helloSignIntegrationEnabled;
  }

  private get hasApprovalMatrix(): boolean {
    return Boolean(find(this.workspaceState?.schema, { type: "approvalMatrix" }));
  }

  private get hasPurchaseOrder(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_PURCHASE_ORDER);
  }

  private get hasRecPurchaseOrder(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_RECEIVE_PURCHASE_ORDER);
  }

  private get hasApproval(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_INLINE_APPROVAL);
  }

  private get hasEquipmentMaintenance(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_EQUIPMENT_MAINTENANCE);
  }

  private get hasRequestApproval(): boolean | undefined {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_REQUEST_APPROVAL);
  }
}

export default FBControlPickerState;
