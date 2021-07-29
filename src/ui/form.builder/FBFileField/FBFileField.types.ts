import { FBFileFieldState, FBInputProps, FBProviderProps } from "..";

export interface FBFile {
  file: File;
}

export type FBFileFieldProps =
& Pick<FBInputProps, "name" | "multiple" | "disabled" | "gutter">
& Pick<FBProviderProps, "formState">
& {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onUploadClick?: () => void;
  fileFieldState?: FBFileFieldState;
  loading?: boolean;
};
