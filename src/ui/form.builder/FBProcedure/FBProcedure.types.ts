import { FBInputProps, FBMediaProps, FBProcedureItemConfig, FBProviderProps } from "..";

export type FBProcedureProps =
& Pick<FBInputProps,
| "name"
| "gutter"
| "stepIndex"
| "index"
| "disabled"
| "loading"
| "autosave"
| "isInputOwner"
| "autoFocus"
| "autoScrollTo">
& Pick<FBProviderProps, "procedureState" | "workspaceState">
& {
  onKeyDown?: (e: KeyboardEvent) => void;
  handleAdd?: (isClone?: boolean, isFromKeys?: boolean) => void;
  isOutput?: boolean;
  isPreview?: boolean;
  types?: string[];
};

export interface FBProcedureValue {
  description?: string;
  materials?: FBProcedureItemConfig[];
  equipment?: FBProcedureItemConfig[];
  attachments?: FBMediaProps[];
}

export const FBProcedureOmitDiffKey: string[] = ["description", "attachments"];
