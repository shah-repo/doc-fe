import { Collection } from "mobx-rest";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../../state/ducks/documentRevisions/constants";
import { FBAutocompleteSelect } from "../../types/autocomplete";
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

  public options(): FBAutocompleteSelect[] {
    const t = this.models.map((o: FBAutocompleteModel) => {
      return { value: o.value, text: o.text, label: o.text } as FBAutocompleteSelect;
    });
    return t;
  }

  public values(): string[] {
    const f = this.models.map((o) => o.get("name"));
    return f;
  }
}

export default new FBAutocompleteCollection(DOCUMENT_REVISION_ROOT_URL);
