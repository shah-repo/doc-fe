import { EBPartPostBody, ProposedDocIdBody } from "..";
import { DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBSupplierState {
  // MARK: @observables

  // MARK: @config

  // MARK: @api
  public newSupplierApi = new FBRequest<DocumentRevision, EBPartPostBody>(FBEndpoint.DocumentRevisionsUrl);
  public proposedDocIdApi = new FBRequest<ProposedDocIdBody, null>(FBEndpoint.FetchDocId);
  public documentTypeApi = new FBRequest<DocumentTypeById, null>(FBEndpoint.FetchDocumentType);

  // MARK: @constructor

  // MARK: @actions

  // MARK: @helpers
  public addNewSupplier = (body: EBPartPostBody) => {
    this.newSupplierApi.set({ body, method: "post" });
  };

  public fetchProposedDocId = (documentTypeId: string) => {
    if (!documentTypeId) { return; }
    this.proposedDocIdApi.set({
      url: FBEndpoint.FetchDocId,
      urlValues: { documentTypeId },
      method: "get",
    });
  };

  public fetchDocumentType = (documentTypeId: string) => {
    if (!documentTypeId) { return; }
    this.documentTypeApi.set({
      url: FBEndpoint.FetchDocumentType,
      urlValues: { documentTypeId },
      method: "get",
    });
  };
}

export default FBSupplierState;
