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

    const docRevsJustification = [
      ...this.documentRevisions as FBDocumentRevisionItem[],
      {
        ...newObjectJustificationChanges,
      },
    ];
    const docRevsDescription = [
      ...this.documentRevisions as FBDocumentRevisionItem[],
      {
        ...newObjectDescriptionChanges,
      },
    ];

    if (type === "description") {
      set(this, "documentRevisions", docRevsDescription );
      return;
    }
    set(this, "documentRevisions", docRevsJustification );
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
