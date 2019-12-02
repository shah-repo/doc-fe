import { Collection } from "mobx-rest";
import { CHANGE_REQUEST_ROOT_URL } from "../../../../../state/ducks/changeRequest/constants";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../../../state/ducks/documentRevisions/constants";
import { DOCUMENT_TYPE_ROOT_URL } from "../../../../../state/ducks/documentRevisions/documentType/constants";
import { SelectOption } from "../../../../components/forms/fields/Select";
import { FBAutocompleteEditorModel } from "../models/FBAutocompleteEditorModel";

export class FBAutocompleteEditorCollection extends Collection<FBAutocompleteEditorModel> {

  public url() {
    return "";
  }

  public model() {
    return FBAutocompleteEditorModel;
  }

  public data(): Array<Partial<FBAutocompleteEditorModel>> {
    return [
        {
          id: "1",
          path: DOCUMENT_REVISION_ROOT_URL,
          label: "Document revisions",
          renderKey: "name",
          params: {},
        },
        {
          id: "2",
          path: CHANGE_REQUEST_ROOT_URL,
          label: "Change requests",
          renderKey: "title",
          params: {},
        },
        {
          id: "3",
          path: `${CHANGE_REQUEST_ROOT_URL}/available_approvers`,
          label: "Approvers",
          renderKey: "email",
          params: {},
        },
        {
          id: "4",
          path: DOCUMENT_TYPE_ROOT_URL,
          label: "Document types",
          renderKey: "documentTypeName",
          params: {},
        },
        {
          id: "5",
          path: DOCUMENT_REVISION_ROOT_URL,
          label: "Suppliers",
          renderKey: "name",
          params: {
            documentTypeAcronym: "SUP",
          },
        },
      ];
  }

  public options(): SelectOption[] {
    return this.data().map((model: Partial<FBAutocompleteEditorModel>) => {
      return {
        value: model.id,
        text: model.label,
      } as SelectOption;
    });
  }

  public getBy(id: string): Partial<FBAutocompleteEditorModel> | undefined {
    const model = this.data().filter((model) => model.id === id);
    return model[0];
  }
}

const autocompleteEditorList = new FBAutocompleteEditorCollection();
export default autocompleteEditorList;
