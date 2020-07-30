import { filter, union } from "lodash";
import { action, get, observable, set } from "mobx";
import * as generateUuid from "uuid/v4";
import { FBSchemaProps } from "..";
import { FBDocumentRevisionItem } from "./FBDocumentRevisions.types";

export class FBDocumentRevisionsState {
  @observable public name = "";
  @observable public documentRevisions?: FBDocumentRevisionItem[] = [];

  public constructor(data?: FBDocumentRevisionItem[]) {
    this.documentRevisions = data || [];
  }

  @action public setDocumentRevisions = (items?: FBDocumentRevisionItem[]) => {
    set(this, "documentRevisions", items);
  };
  @action public getSchema = (): FBSchemaProps[] => get(this, "schema");

  @action public editTextFields = (item: string, index: number, type: string) => {
    const newObjectDescriptionChanges = {
      ...this.documentRevisions?.[index],
      descriptionOfChange: item,
    };

    const newObjectJustificationChanges = {
      ...this.documentRevisions?.[index],
      justificationOfChange: item,
    };

    const updateDocumentRevision = this.documentRevisions?.map((e, indexOfDoc) => {
      if ( indexOfDoc === index) {
        if (type === "description") {
          return e[indexOfDoc] = newObjectDescriptionChanges;
        }
        return e[indexOfDoc] = newObjectJustificationChanges;
      }
      return this.documentRevisions?.[indexOfDoc];
    });
    this.setDocumentRevisions(updateDocumentRevision as FBDocumentRevisionItem[]);
  };

  public addDocRevItem = (item: FBDocumentRevisionItem) => {
    item = {
      ...item,
      id: generateUuid(),
    };
    const documentRevisions = union(this.documentRevisions || [], [item]);
    this.setDocumentRevisions(documentRevisions);
  };

  public removeDocRevItem = (id: string) => {
    const documentRevisions = filter(this.documentRevisions, (doc) => doc.proposedDocumentRevision.id !== id);
    this.setDocumentRevisions(documentRevisions);
  };
}

export default FBDocumentRevisionsState;
