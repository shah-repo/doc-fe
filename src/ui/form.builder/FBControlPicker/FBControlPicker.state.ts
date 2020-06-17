import { find } from "lodash";
import React from "react";
import { FBControlPickerDataProps, FBInputType, FBWorkspaceState } from "..";
import { GroupTag } from "../../../state/ducks/auth/types";
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
        "quantity",
        "timer",
        ...this.hasPurchaseOrder ? ["purchaseorder"] as FBInputType[] : [],
        ...this.hasRecPurchaseOrder ? ["poreceive"] as FBInputType[] : [],
        ...this.hasApprovalMatrix ? ["approvalMatrix"] as FBInputType[] : [],
        "poApprovalMatrix",
        "instructionsmediaupload",
        "evidencemediaupload",
        "testRequirement",
      ],
      approvals: [
        ...this.hasHelloSign ? ["hellosign"] as FBInputType[] : [],
        ...this.hasApproval ? ["approval"] as FBInputType[] : [],
        ...this.hasRequestApproval ? ["requestapproval"] as FBInputType[] : [],
      ],
      customcontrols: ["customcontrol"],
      instructions: ["instructionsdocument", "selectdocument", "selectrequirement"],
      buttons: ["checkpoint", "createlabel"],
      actions: ["action"],
    };
  }

  private get hasHelloSign(): boolean {
    return this.workspaceState?.comapny?.companyMine.helloSignIntegrationEnabled || false;
  }

  private get hasApprovalMatrix(): boolean {
    return Boolean(find(this.workspaceState?.schema, { type: "approvalMatrix" })) || false;
  }

  private get hasPurchaseOrder(): boolean {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_PURCHASE_ORDER) || false;
  }

  private get hasRecPurchaseOrder(): boolean {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_RECEIVE_PURCHASE_ORDER) || false;
  }

  private get hasApproval(): boolean {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_INLINE_APPROVAL) || false;
  }

  private get hasRequestApproval(): boolean {
    return this.workspaceState?.userTags?.includes(GroupTag.FB_COMPONENT_REQUEST_APPROVAL) || false;
  }
}

export default FBControlPickerState;
