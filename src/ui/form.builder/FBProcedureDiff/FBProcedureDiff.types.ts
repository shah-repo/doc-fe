import { FBInputProps } from "..";
import { FBProviderProps } from "../FBProvider";

export type FBProcedureDiffProps =
& Pick<FBInputProps, "name" | "gutter" | "withState">
& Pick<FBProviderProps, "procedureDiffState">
& {
  handleChange?: () => void;
  checked?: boolean;
};
