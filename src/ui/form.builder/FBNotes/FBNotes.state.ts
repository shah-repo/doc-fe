import { action, observable, set } from "mobx";
import { FBNoteItem } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBNoteBody } from "./FBNotes.types";

class FBNotesState extends FBRequest<FBNoteItem[], FBNoteBody> {
  @observable public notes?: FBNoteItem[];

  public constructor(notes?: FBNoteItem[], name?: string) {
    super();
    this.notes = notes;
  }

  @action public setNotes = (notes?: FBNoteItem[]) => {
    set(this, "notes", notes);
  };

  public onSuccess() {
    if (!this.data) { return; }
    this.setNotes(this.data);
    super.onSuccess();
  }

  public fetchNotes = (documentRevisionId: string) => {
    this.setUrl(FBEndpoint.Notes);
    this.setBody({ documentRevisionId });
    this.fetch();
  };
}

export default FBNotesState;
