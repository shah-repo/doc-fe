import { observable } from "mobx";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

interface EBPartPatchBody {
  childrenParts: [
    { id: string }
  ];
}

export class FBEBPartState extends FBRequest<EBPartPatchBody, null> {
  // MARK: @observables
  @observable public childrenParts?: any;

  // MARK: @config
  public docRevApi = new FBRequest<any, any>(FBEndpoint.PatchDocumentRevision);

  // MARK: @constructor
  public constructor(childrenParts: string) {
    super();
    this.childrenParts = childrenParts;
  }

  // MARK: @actions

  // MARK: @helpers
  public addExistingPartChild = (docRevId?: string, childPartId?: string) => {
    if (!docRevId || !childPartId) { return; }
    this.docRevApi.setTemplateUrl(FBEndpoint.PatchDocumentRevision, { docRevId });
    this.docRevApi.setBody({ childrenParts: [{ id: childPartId }] });
    this.docRevApi.patch();
  };
}

export default FBEBPartState;
