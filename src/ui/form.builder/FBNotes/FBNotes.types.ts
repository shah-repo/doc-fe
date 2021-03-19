import { FBProviderProps } from "../FBProvider/FBProvider.types";
import FBNotesState from "./FBNotes.state";

export type FBNotesProps =
& Pick<FBProviderProps, "dialogState">
& {
  onClick?: () => void;
  name?: string;
  notesNumber?: number | 0;
  notesState?: FBNotesState;
};
