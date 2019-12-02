import { Dictionary } from "lodash";
import { Model } from "mobx-rest";

export class FBAutocompleteEditorModel extends Model {
    public path: string = "";
    public label: string = "";
    public renderKey: string = "";
    public params: Dictionary<any> = {};
}
