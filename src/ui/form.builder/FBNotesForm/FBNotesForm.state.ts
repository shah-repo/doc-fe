import { union } from "lodash";
import { action, observable, set } from "mobx";
import { FBNote, FBNoteItem } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBNotesFormState extends FBRequest<FBNoteItem, FBNote> {
  @observable public notes?: FBNoteItem[];
  @observable public files?: any[];

  public constructor(notes?: FBNoteItem[]) {
    super();
    this.notes = notes;
  }

  @action public setNotes = (notes?: FBNoteItem[]) => {
    set(this, "notes", notes);
  };

  @action public setfiles = (files?: any[]) => {
    set(this, "files", files);
  };

  public onSuccess() {
    if (!this.data) { return; }
    this.setNotes(union(this.notes || [], [this.data]));
    super.onSuccess();
  }

  public setNote = (note?: FBNote) => {
    if (!note) { return; }
    this.addNote(note);
  };

  private addNote = (note: FBNote) => {
    this.setUrl(FBEndpoint.Notes);
    this.setBody(note);
    this.post();
  };
}

export default FBNotesFormState;
