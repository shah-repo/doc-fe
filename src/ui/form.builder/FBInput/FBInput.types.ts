import { BaseTextFieldProps, BoxProps } from "@material-ui/core";
import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { Dictionary } from "lodash";
import { FBEditorOptionsProps, FBEditorPropertiesType, FBEditorValidationMode, FBInlineApprovalRole, FBInputState, FBLabelProps, FBOptionProps, FBSchemaState } from "..";
import { Employee } from "../../../state/ducks/company/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import { FBValidatorConfigProps } from "../types/validation/validatorDialog";

type FBInputTransform = "upper" | "lower";
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
  | "ebpart"
  | "eqmaintenance"
  | "textfieldwithrange"
  | "range"
  | "passpercentage"
  | "supplier"
  | "mpiprocedure"
  | "lhrstep"
  | "unitMeasures"
  | "quantityunit"
  | "partsselection"
  | "mediaalbum"
  | "poapprovals";

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
    isInputOwner?: boolean;
    designDisabled?: boolean;
    /**
     * @cfg {Bool} Whether the field can be deleted in the output document.
     */
    deleteDisabled?: boolean;
    /**
     * @cfg {Bool} Whether the field can be deleted in the form.
     */
    deleteInFormDisabled?: boolean;
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
    // Field is under validation for validation mode (e.g show/hide)
    // but should not be included in the next form validation flow (e.g on form save)
    omitFinalValidation?: boolean;
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
    /**
     * @cfg {Bool} Include component into validation schema select option.
     */
    applicableValidationSchema?: boolean;
    /**
     * @cfg {Bool} Any additional config we want to pass to the input.
     */
    editorConfig?: any;
    /**
     * @cfg {Bool} MUI Box props that can be passed to input section.
     */
    boxProps?: BoxProps;
    inspectionSection?: boolean;
    /**
     * @cfg {String} Validation attribute name. Use this prop for non labeled controls.
     */
    validationAttribute?: string;
    /**
     * @cfg {Bool} Flag for control inputs which values we need to generate control's
     * value but we need to omit it from form values.
     */
    omitFormValue?: boolean;
    /**
     * @cfg {Bool} Item is deleted. It will not be visible but will remain in scheme.
     */
    deleted?: boolean;
    // /**
    //  * @cfg {Bool} true to force form validation on input render if its default value
    //  * is validation relation.
    //  */
    // validateDefaultValue?: boolean;
    includeNotes?: boolean;
    isOutput?: boolean;
    /**
     * @cfg {Bool} If true focus the texteditor on render.
     */
    autoFocus?: boolean;
    /**
     * @cfg {Bool} If true scroll to el on render.
     */
    autoScrollTo?: boolean;
    /**
     * @cfg {Bool} If true field is disabled.
     */
    locked?: boolean;

    /**
     * @cfg {string} Username that holds the lock.
     */
    lockOwnerName?: string;
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
  "mpiprocedure",
  "procedurediff",
  "eqmaintenance",
  "ebpart",
  "parts",
  "range",
  "passpercentage",
  "poreceive",
  "quantityunit",
  "instructionsmediaupload",
  "evidencemediaupload",
  "mediaalbum",
  "lhrstep",
];

export const OmitIncludeNotes: FBInputType[] = [
  "stepsection",
  "teststep",
  "section",
  "subsection",
];

export interface FBInputConstructor {
  value: any;
  hidden?: boolean;
}
