import { Dictionary } from "lodash";
import { FBInputProps, FBSchemaState, FBWorkspaceMode } from "..";

export type FBSchemaProps = Pick<FBInputProps,
  | "label"
  | "name"
  | "type"
  | "disabled"
  | "index"
  | "placeholder"
  | "rows"
  | "editorProperties"
  | "options"
  | "optionId"
  | "optionValueKey"
  | "optionLabelKey"
  | "optionValueType"
  | "linkUrl"
  | "multiple"
  | "defaultChecked"
  | "rules"
  | "validationMode"
  | "paragraph"
  | "testRequirement"
  | "isTemplate"
  | "stepIndex"
  | "includeQRScan"
  | "instructionsDocument"
  | "reviseDisabled"
  | "outputDisabled"
  | "customValidator"
  | "defaultValue"
  | "approvers"
  | "approverGroups"
  | "approvalRoles"
  | "approveIsBlocking"
  | "applicableOn"
  | "actions"
  | "transform"
  | "bookmarked"
  | "uniqueSchemaItem"
  | "applicableValidationSchema"
  | "editorConfig"
  | "inspectionSection"
  | "validationAttribute"
  | "deleteDisabled"
  | "hidden"
  | "deleted"
  | "deleteInFormDisabled"
> & {
  validators?: Dictionary<any>;
};

export interface FBSchemaComponentProps {
  workspaceMode?: FBWorkspaceMode;
  schema?: FBSchemaProps[];
  schemaState?: FBSchemaState;
}
