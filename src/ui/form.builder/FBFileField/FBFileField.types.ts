import { FBFileFieldState, FBInputProps } from "..";

export interface FBFile {
  file: File;
}

export type FBFileFieldProps =
& Pick<FBInputProps, "name" | "multiple" | "disabled" | "gutter">
& {
  fileFieldState?: FBFileFieldState;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  loading?: boolean;
};
