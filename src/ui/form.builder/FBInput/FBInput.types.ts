import { BaseTextFieldProps } from "@material-ui/core";
import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { Dictionary } from "lodash";
import { FBEditorOptionsProps, FBEditorPropertiesType, FBInlineApprovalRole, FBInputState, FBLabelProps, FBOptionProps, FBSchemaState } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBEditorValidationMode } from "../FBEditorValidation";
import { FBValidatorConfigProps } from "../types/validation/validatorDialog";

export type FBInputTransform = "upper" | "lower";
export type FBVisibilityType = "visible" | "hidden";

export type FBInputType =
  | "url"
  | "number"
  | "textfield"
  | "checkbox"
  | "checkboxgroup"
  | "section"
  | "subsection"
  | "datepicker"
  | "texteditor"
  | "select"
  | "radio"
  | "radiogroup"
  | "autocomplete"
  | "autocompleteasync"
  | "hyperlink"
  | "fileupload"
  | "schemaItem"
  | "action"
  | "summarysection"
  | "editoroptions"
  | "schemaselect"
  | "paragraph"
  | "documentRevisions"
  | "testRequirement"
  | "instructionsmediaupload"
  | "evidencemediaupload"
  | "purchaseorder"
  | "approvalMatrix"
  | "poreceive"
  | "stepsection"
  | "teststep"
  | "checkpoint"
  | "approval"
  | "inlineapproval"
  | "createlabel"
  | "quantity"
  | "timer"
  | "requestapproval"
  | "instructionsdocument"
  | "selectdocument"
  | "selectrequirement"
  | "testRequirement"
  | "hellosign"
  | "customcontrol"
  | "poApprovalMatrix"
  | "task"
  | "approvers"
  | "blanktplform"
  | "approvals"
  | "procedure"
  | "parts"
  | "procedurediff"
  | "ebpart";

export type FBInputProps =
  & FBLabelProps
  & FBOptionProps
  & FBEditorOptionsProps
  & Pick<AutocompleteProps, "multiple">
  & Pick<BaseTextFieldProps,
    | "children"
    | "error"
    | "value"
    | "disabled"
    | "name"
    | "helperText"
    | "rows"
    | "placeholder"
    | "defaultChecked"
    | "hidden"
  > & {
    onBlur?: (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => any;
    onChange?: (ev: React.ChangeEvent<any> | any, value: any, context?: FBSchemaState) => any;
    setTranform?: (value: string) => string;
    type?: FBInputType;
    index?: number;
    stepIndex?: number;
    gutter?: boolean;
    linkUrl?: string;
    defaultValue?: any;
    inputState?: FBInputState;
    editorProperties?: FBEditorPropertiesType[];
    includeContext?: boolean;
    rules?: any;
    validationMode?: FBEditorValidationMode;
    includeSelectedSchema?: boolean;
    paragraph?: string;
    testRequirement?: string;
    isTemplate?: boolean;
    includeQRScan?: boolean;
    designDisabled?: boolean;
    deleteDisabled?: boolean;
    instructionsDocument?: string;
    reviseDisabled?: boolean;
    outputDisabled?: boolean;
    customValidator?: FBValidatorConfigProps;
    approvers?: string[] | Employee[];
    approverGroups?: string[] | GroupRequestBody[];
    approvalRoles?: string[] | FBInlineApprovalRole[];
    approveIsBlocking?: boolean;
    applicableOn?: any[];
    actions?: string[];
    hellosignFlowProps?: any;
    showErrorMsg?: boolean;
    validators?: Dictionary<any>;
    forceDefault?: boolean;
    autosave?: boolean;
    transform?: FBInputTransform;
    dataCy?: string;
    withState?: boolean;
    bookmarked?: boolean;
    /**
     * @cfg {Bool} Whether the type added to the schema must be unique.
     * El with a type marked as a uniqueSchemaItem can be added to the schema only once.
     */
    uniqueSchemaItem?: boolean;
  };

export const OmitInputClones: FBInputType[] = [
  "section",
  "fileupload",
  "documentRevisions",
  "approvers",
  "approval",
  "blanktplform",
  "inlineapproval",
  "approvals",
  "texteditor",
  "procedure",
  "procedurediff",
];
