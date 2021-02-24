import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBEditorCustomControlState extends FBRequest<DocumentRevision[], any> {
  public url = FBEndpoint.DynamicControl;

  public constructor() {
    super();
    this.fetch();
  }
}

export default FBEditorCustomControlState;
