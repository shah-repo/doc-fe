import { observable } from "mobx";
import { EBPartPatchBody, EBPartPostBody, ProposedDocIdBody } from ".";
import { Document } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBEBPartState extends FBRequest<EBPartPatchBody | EBPartPostBody, null> {
  // MARK: @observables
  @observable public childrenParts?: any;

  // MARK: @config
  public existingChildApi = new FBRequest<null, EBPartPatchBody>(FBEndpoint.PatchDocumentRevision);
  public newChildApi = new FBRequest<null, EBPartPostBody>(FBEndpoint.DocumentRevisionsUrl);
  public proposedDocIdApi = new FBRequest<ProposedDocIdBody, null>(FBEndpoint.FetchDocId);
  public documentApi = new FBRequest<Document, null>(FBEndpoint.Document);

  // MARK: @constructor
  public constructor(childrenParts?: string) {
    super();
    this.childrenParts = childrenParts;
  }

  // MARK: @actions

  // MARK: @helpers
  public addExistingPartChild = (docRevId?: string, childPartId?: string) => {
    if (!docRevId) { return; }
    const childrenParts = childPartId ? [{ id: childPartId }] : [];
    this.existingChildApi.setTemplateUrl(FBEndpoint.PatchDocumentRevision, { docRevId });
    this.existingChildApi.setBody({ childrenParts });
    this.existingChildApi.patch();
  };

  public addNewPartChild = (values) => {
    this.newChildApi.setUrl(FBEndpoint.DocumentRevisionsUrl);
    this.newChildApi.setBody(values);
    this.newChildApi.post();
  };

  public fetchProposedDocId = (documentTypeId: string) => {
    this.proposedDocIdApi.setTemplateUrl(FBEndpoint.FetchDocId, { documentTypeId });
    this.proposedDocIdApi.fetch();
  };

  public fetchDocumentById = (id: string) => {
    this.documentApi.setTemplateUrl(FBEndpoint.Document, { id });
    this.documentApi.fetch();
  };
}

export default FBEBPartState;
