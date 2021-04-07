import { union } from "lodash";
import { action, observable, set } from "mobx";
import { FBNote, FBNoteByDocument, FBNoteItem } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBNotesFormState extends FBRequest<FBNoteItem[] | FBNoteItem, FBNote | FBNoteByDocument> {
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
    switch (this.method) {
      case "get": {
        const fetchedData = this.data as FBNoteItem[];
        const data = fetchedData?.sort(function(a, b) {
          return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
        }) || [];
        this.setNotes(data);
        break;
      }
      case "post": {
        this.setNotes(union(this.notes || [], [this.data as FBNoteItem]));
        break;
      }
      default: break;
    }
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

  public fetchNotes = (documentRevisionId: string) => {
    this.setUrl(FBEndpoint.Notes);
    this.setBody({ documentRevisionId });
    this.fetch();
  };
}

export default FBNotesFormState;
