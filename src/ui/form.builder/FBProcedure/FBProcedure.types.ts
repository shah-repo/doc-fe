import { FBInputProps, FBProcedureItemConfig } from "..";
import { FBMediaProps } from "../FBMediaAlbum";
import { FBProviderProps } from "../FBProvider";

export type FBProcedureProps =
& Pick<FBInputProps, "name" | "gutter" | "stepIndex" | "index" | "disabled" | "loading" | "autosave">
& Pick<FBProviderProps, "procedureState">
& {
  handleAdd?: (isClone?: boolean) => void;
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
