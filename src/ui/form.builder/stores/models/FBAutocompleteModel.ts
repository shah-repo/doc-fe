import { Model } from "mobx-rest";

export class FBAutocompleteModel extends Model {
  get value() {
    return this.get("id");
  }
  get text() {
    return this.get("name");
  }

  get label() {
    return this.get("name");
  }
}
