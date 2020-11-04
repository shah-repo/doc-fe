import { includes } from "lodash";
import { action, observable, set } from "mobx";
import React from "react";
import { FBEditorMode, FBEditorModeProps, FBEditorProps, FBInputType } from "..";
import { FBEditorAction } from "../FBEditorAction";
import { FBEditorApprovalField } from "../FBEditorApprovalField";
import { FBEditorApprovals } from "../FBEditorApprovals";
import { FBEditorAutocomplete } from "../FBEditorAutocomplete";
import { FBEditorCheckControl } from "../FBEditorCheckControl";
import { FBEditorEmpty } from "../FBEditorEmpty";
import { FBEditorHyperlink } from "../FBEditorHyperlink";
import { FBEditorInlineApproval } from "../FBEditorInlineApproval";
import { FBEditorInstructionsDocument } from "../FBEditorInstructionsDocument";
import { FBEditorLabel } from "../FBEditorLabel";
import { FBEditorMediaAlbum } from "../FBEditorMediaAlbum";
import { FBEditorOptionGroup } from "../FBEditorOptionGroup";
import { FBEditorParagraph } from "../FBEditorParagraph";
import { FBEditorRequestApproval } from "../FBEditorRequestApproval";
import { FBEditorSelectDocument } from "../FBEditorSelectDocument";
import { FBEditorSelectRequirement } from "../FBEditorSelectRequirement";
import { FBEditorTestRequirement } from "../FBEditorTestRequirement";
import { FBEditorTextEditor } from "../FBEditorTextEditor";
import { FBEditorTextField } from "../FBEditorTextField";

export class FBEditorState {

  public static omitValidation: FBInputType[] = [
    "section",
    "subsection",
    "stepsection",
    "teststep",
    "hyperlink",
    "action",
    "paragraph",
    "quantity",
    "timer",
    "purchaseorder",
    "instructionsmediaupload",
    "evidencemediaupload",
    "testRequirement",
    "instructionsdocument",
    "selectdocument",
    "selectrequirement",
    "documentRevisions",
    "checkpoint",
    "createlabel",
    "poreceive",
    "approval",
    "inlineapproval",
    "requestapproval",
    "hellosign",
    "approvalMatrix",
    "poApprovalMatrix",
    "task",
    "blanktplform",
    "approvals",
    "procedure",
    "eqmaintenance",
  ];

  public static pickDefaultValue: FBInputType[] = [
    "quantity",
    "timer",
    "stepsection",
    "teststep",
    "instructionsmediaupload",
    "evidencemediaupload",
    "testRequirement",
    "instructionsdocument",
    "selectdocument",
    "selectrequirement",
    "checkpoint",
    "createlabel",
    "approval",
    "inlineapproval",
    "requestapproval",
    "blanktplform",
    "approvals",
  ];

  public static pickStepIndex: FBInputType[] = ["stepsection", "teststep", "procedure"];

  public static pickCustomHandler: FBInputType[] = ["teststep"];

  private static editors: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    section: FBEditorLabel,
    subsection: FBEditorLabel,
    stepsection: FBEditorLabel,
    teststep: FBEditorLabel,
    textfield: FBEditorTextField,
    checkbox: FBEditorCheckControl,
    checkboxgroup: FBEditorOptionGroup,
    autocomplete: FBEditorAutocomplete,
    texteditor: FBEditorTextEditor,
    datepicker: FBEditorLabel,
    hyperlink: FBEditorHyperlink,
    select: FBEditorOptionGroup,
    radio: FBEditorCheckControl,
    radiogroup: FBEditorOptionGroup,
    fileupload: FBEditorLabel,
    blanktplform: FBEditorLabel,
    paragraph: FBEditorParagraph,
    quantity: FBEditorLabel,
    timer: FBEditorLabel,
    purchaseorder: FBEditorLabel,
    poreceive: FBEditorLabel,
    instructionsmediaupload: FBEditorMediaAlbum,
    evidencemediaupload: FBEditorMediaAlbum,
    testRequirement: FBEditorTestRequirement,
    instructionsdocument: FBEditorInstructionsDocument,
    selectdocument: FBEditorSelectDocument,
    selectrequirement: FBEditorSelectRequirement,
    checkpoint: FBEditorLabel,
    createlabel: FBEditorLabel,
    approval: FBEditorApprovalField,
    inlineapproval: FBEditorInlineApproval,
    requestapproval: FBEditorRequestApproval,
    action: FBEditorAction,
    hellosign: FBEditorLabel,
    approvalMatrix: FBEditorEmpty,
    documentRevisions: FBEditorEmpty,
    poApprovalMatrix: FBEditorLabel,
    task: FBEditorLabel,
    approvals: FBEditorApprovals,
    procedure: FBEditorEmpty,
    parts: FBEditorEmpty,
    eqmaintenance: FBEditorEmpty,
  };

  @observable public mode?: FBEditorMode = "config";
  public modeConfig: FBEditorModeProps[] = [
    {
      mode: "config",
      label: "form.builder.field.config",
    },
    {
      mode: "validation",
      label: "form.builder.validation",
    },
  ];

  public static editor = (editorProps: FBEditorProps): React.ReactElement | undefined => {
    const { inputProps: { type = "", index = 0 } = {} } = editorProps;
    const editorControl = FBEditorState.editors[type];
    if (!editorControl) {
      return;
    }
    return React.createElement(editorControl, {
      key: `fb-editor-${type}-${index}`,
      ...editorProps,
      ...type && ({ underValidation: FBEditorState.underValidation(type) }),
      ...type && ({ includeDefaultValue: FBEditorState.includeDefaultValue(type) }),
    });
  };

  public static underValidation = (type: FBInputType) => !includes(FBEditorState.omitValidation, type);
  public static includeDefaultValue = (type: FBInputType) => includes(FBEditorState.pickDefaultValue, type);

  @action public setMode = (mode: FBEditorMode) => set(this, "mode", mode);
}

export default FBEditorState;
