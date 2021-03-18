import { FBProviderProps } from "../FBProvider/FBProvider.types";

export type FBNotesProps =
& Pick<FBProviderProps, "dialogState">
& {
  onClick?: () => void;
  name?: string;
};
