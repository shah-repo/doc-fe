import { action, observable, set } from "mobx";
import { EBPartPatchBody, EBPartPostBody, ProposedDocIdBody } from ".";
import { Document, DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBEBPartState {
  // MARK: @observables
  @observable public childrenParts?: string;

  // MARK: @config
  public forceNewRender?: boolean;

  // MARK: @api
  public existingChildApi = new FBRequest<null, EBPartPatchBody>(FBEndpoint.PatchDocumentRevision);
  public newChildApi = new FBRequest<DocumentRevision, EBPartPostBody>(FBEndpoint.DocumentRevisionsUrl);
  public proposedDocIdApi = new FBRequest<ProposedDocIdBody, null>(FBEndpoint.FetchDocId);
  public documentApi = new FBRequest<Document, null>(FBEndpoint.Document);

  // MARK: @constructor
  public constructor(childrenParts?: string) {
    this.childrenParts = childrenParts;
  }

  // MARK: @actions
  @action public setChildrenParts = (childrenParts?: string) =>
    set(this, "childrenParts", childrenParts);

  // MARK: @helpers
  public setNewRender = (state: boolean) => set(this, "forceNewRender", state);

  public addExistingPartChild = (docRevId?: string, childPartId?: string) => {
    if (!docRevId) { return; }
    const childrenParts = childPartId ? [{ id: childPartId }] : [];
    this.existingChildApi.set({
      url: FBEndpoint.PatchDocumentRevision,
      urlValues: { docRevId },
      body: { childrenParts },
      method: "patch",
    });
  };

  public addNewPartChild = (body: EBPartPostBody) =>
    this.newChildApi.set({ body, method: "post" });

  public fetchProposedDocId = (documentTypeId: string) => this.proposedDocIdApi.set({
    url: FBEndpoint.FetchDocId,
    urlValues: { documentTypeId },
    method: "get",
  });

  public fetchDocumentById = (id: string) => this.documentApi.set({
    url: FBEndpoint.Document,
    urlValues: { id },
    method: "get",
  });
}

export default FBEBPartState;
