import { FBWorkspaceState } from ".";
import { FBSchemaProps } from "..";
import { FBDialogState } from "../FBDialog";
import { FBFormProps } from "../FBForm";


export type FBWorkspaceMode = "none" | "design" | "form" | "preview";

export type FBWorkspaceProps =
& Pick<FBFormProps, "initialValues" | "children">
& {
  schema?: FBSchemaProps[];
  mode?: FBWorkspaceMode;
  isStarter?: boolean;
  active?: boolean;
  portalContainer?: React.MutableRefObject<null>;
  dialogState?: FBDialogState;
  workspaceState?: FBWorkspaceState;
};
