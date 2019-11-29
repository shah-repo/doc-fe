import _ from "lodash";
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

  public data(): any[] {
    return _.map(this.models, (model) => model.toJS());
  }

  public getBy(id: string): any {
    const model = this.find({ id });
    return model && model.toJS();
  }
}

export default FBAutocompleteCollection;
