import { FBFormProps } from "..";
import { Id } from "../../../state/ducks/common/types";

export type FBNotesFormProps =
& FBFormProps
& {
  handleNote?: () => void;
  files?: Id[];
};
