import { Collection } from "mobx-rest";
import { FBAutocompleteModel } from "../models/FBAutocompleteModel";

export class FBAutocompleteCollection extends Collection<FBAutocompleteModel> {
  private urlStr: string = "";
  private keyStr: string = "";

  public url() {
    return this.urlStr;
  }

  public model() {
    return FBAutocompleteModel;
  }

  public setArgs(url: string, key: string) {
    this.urlStr = url;
    this.keyStr = key;
  }

  public data(): any[] {
    return this.models.map((o) => {
      return {
        ...o,
        value: o.id,
        text: o.get(this.keyStr),
        label: o.get(this.keyStr),
      };
    });
  }
}

const autocompleteList = new FBAutocompleteCollection();
export default autocompleteList;
