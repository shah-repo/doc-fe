import { BaseTextFieldProps } from "@material-ui/core";
import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { Dictionary } from "lodash";
import { FBEditorOptionsProps, FBEditorPropertiesType, FBInlineApprovalRole, FBInputState, FBLabelProps, FBOptionProps, FBSchemaState } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { FBEditorValidationMode } from "../FBEditorValidation";
import { FBValidatorConfigProps } from "../types/validation/validatorDialog";

export type FBInputTransform = "upper" |  "lower";

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
  | "approvers";

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
  rules?: string;
  validationMode?: FBEditorValidationMode;
  includeSelectedSchema?: boolean;
  paragraph?: string;
  testRequirement?: string;
  isTemplate?: boolean;
  includeQRScan?: boolean;
  designDisabled?: boolean;
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
  withState?: boolean;
};

export const OmitInputClones: FBInputType[] = [
  "fileupload",
  "documentRevisions",
  "approvers",
];
