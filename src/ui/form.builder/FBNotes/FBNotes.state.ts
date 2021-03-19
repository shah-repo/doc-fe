import { action, observable, set } from "mobx";

class FBNotesState {
  @observable public noteNumber?: number;

  public constructor(noteNumber?: number) {
    this.noteNumber = noteNumber || 0;
  }

  @action public setNumberOfNotes = (noteNumber?: number) => {
    set(this, "noteNumber", noteNumber);
  };
}

export default FBNotesState;
