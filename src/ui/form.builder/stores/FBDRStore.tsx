import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType";
import formBuilderStore from "./FBStore";
import { canEditDocumentRevision } from "../../document.revision/utils/helpers";

export type FBDocumentRevisionRequestType =
  | "none"
  | "create"
  | "update"
  | "fbCreate"
  | "fbUpdate";

type FBDocumentRevisionMode =
  | "none"
  | "create"
  | "update"
  | "preview"
  | "updateFromOther"
  | "createFrom";

export class FBDocumentRevisionStore {
    @observable public mode: FBDocumentRevisionMode = "none";

    @action public setInitialFBMode = (group: DocumentGroupType) => {
        const docRevMode = (group === "FORM") ? "create" : "none";
        this.setMode(docRevMode);
    }

    @action public setValues = (values: DocumentRevision) => {
      const fbGroup = _.get(values, "document.documentType.group");

      // TEMPLATE FORM
      if (fbGroup && fbGroup === "FORM") {
        const schema = _.get(values, "formTemplate.schema");
        const { formTemplate } = values;
        let docRevMode: FBDocumentRevisionMode = formTemplate ? "update" : "create";

        if (docRevMode === "update" && !canEditDocumentRevision(values)) {
          docRevMode = "preview";
        }

        this.setMode(docRevMode);
        formBuilderStore.setSchema(schema);
      } else {
        this.setMode("none");
      }
    }

    @action public setMode = (mode: FBDocumentRevisionMode) => {
      this.mode = mode;
      switch (mode) {
        case "none":
          return formBuilderStore.setMode("none");
        case "create":
        case "update":
          return formBuilderStore.setMode("design");
        case "preview":
          return formBuilderStore.setMode("preview");
      }
    }
}

const documentRevisionStore1 = new FBDocumentRevisionStore();
export default documentRevisionStore1;
