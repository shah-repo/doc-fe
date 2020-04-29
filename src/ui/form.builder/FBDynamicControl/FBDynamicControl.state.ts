import { action } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBDynamicControlState extends FBRequest<DocumentRevision[], any> {
  public url = FBEndpoint.DynamicControl;
  public controlApi = new FBRequest<DocumentRevision, any>();

  public constructor() {
    super();
    this.fetch();
  }

  @action public setControlUrl = (id: string) => {
    this.controlApi.setUrl("/document_revisions/" + id);
    this.controlApi.fetch();
  };
}

export default FBDynamicControlState;
