import { Collection } from "mobx-rest";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../../state/ducks/documentRevisions/constants";
import { SelectOption } from "../../../components/forms/fields/Select";
import { FBAutocompleteModel } from "../models/FBAutocompleteModel";

class FBAutocompleteCollection extends Collection<FBAutocompleteModel> {
  private urlStr: string = "";

  constructor(url: string) {
    super();
    this.urlStr = url;
  }
  public url() {
    return this.urlStr;
  }

  public model() {
    return FBAutocompleteModel;
  }

  public options(): SelectOption[] {
    const t = this.models.map((o: FBAutocompleteModel) => {
      return { value: o.value, text: o.text } as SelectOption;
    });
    return t;
  }

  public values(): string[] {
    const f = this.models.map((o) => o.get("name"));
    return f;
  }
}

export default new FBAutocompleteCollection(DOCUMENT_REVISION_ROOT_URL);
