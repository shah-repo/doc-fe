import { Dictionary } from "lodash";
import { FBInputProps, FBSchemaState, FBWorkspaceMode } from "..";

export type FBSchemaProps = Pick<FBInputProps,
| "label"
| "name"
| "type"
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
> & {
  validators?: Dictionary<any>;
};

export interface FBSchemaComponentProps {
  workspaceMode?: FBWorkspaceMode;
  schema?: FBSchemaProps[];
  schemaState?: FBSchemaState;
}
