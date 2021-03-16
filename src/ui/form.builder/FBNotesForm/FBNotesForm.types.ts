import { FBFormProps } from "..";

export type FBNotesFormProps =
& FBFormProps
& {
  handleNote?: () => void;
};
