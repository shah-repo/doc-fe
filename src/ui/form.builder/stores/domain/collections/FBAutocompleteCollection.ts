import { Collection } from "mobx-rest";
import { FBAutocompleteModel } from "../models/FBAutocompleteModel";

export class FBAutocompleteCollection extends Collection<FBAutocompleteModel> {
  private path: string = "";

  constructor(path: string) {
    super();
    this.path = path;
    this.fetch();
  }

  public url() {
    return this.path;
  }

  public model() {
    return FBAutocompleteModel;
  }
}

export default FBAutocompleteCollection;
