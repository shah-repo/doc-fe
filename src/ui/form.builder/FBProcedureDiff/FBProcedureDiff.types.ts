import { FBInputProps, FBProviderProps } from "..";

export type FBProcedureDiffProps =
& Pick<FBInputProps, "name" | "gutter" | "withState">
& Pick<FBProviderProps, "procedureDiffState">
& {
  handleChange?: () => void;
  checked?: boolean;
};
