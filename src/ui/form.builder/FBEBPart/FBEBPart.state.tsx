import { omit } from "lodash";
import { action, observable, set } from "mobx";
import { EBPartPatchBody, EBPartPostBody, ProposedDocIdBody } from "..";
import { DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType/types";
import { Document, DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from "../FBInput/FBInput.wrap";

class FBEBPartState {
  // MARK: @observables
  @observable public childrenParts?: string;
  @observable public childrenPartsForRevise?: string;

  // MARK: @config

  // MARK: @api
  public existingChildApi = new FBRequest<null, EBPartPatchBody>(FBEndpoint.PatchDocumentRevision);
  public newChildApi = new FBRequest<DocumentRevision, EBPartPostBody>(FBEndpoint.DocumentRevisionsUrl);
  public proposedDocIdApi = new FBRequest<ProposedDocIdBody, null>(FBEndpoint.FetchDocId);
  public documentApi = new FBRequest<Document, null>(FBEndpoint.Document);
  public documentTypeApi = new FBRequest<DocumentTypeById, null>(FBEndpoint.FetchDocumentType);

  // MARK: @constructor
  public constructor(children: { childrenParts?: string; childrenPartsForRevise?: string }) {
    this.childrenParts = children.childrenParts;
    this.childrenPartsForRevise = children.childrenPartsForRevise;
  }

  // MARK: @actions
  @action public setChildrenParts = (childrenParts?: string) =>
    set(this, "childrenParts", childrenParts);

  // MARK: @helpers
  public addExistingPartChild = (docRevId?: string, body?: EBPartPatchBody) => {
    if (!docRevId) { return; }
    body = {
      ...body, formInput: omit(body?.formInput,
        Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES }),
      ),
    } as EBPartPatchBody;

    this.existingChildApi.set({
      url: FBEndpoint.PatchDocumentRevision,
      urlValues: { docRevId },
      body,
      method: "patch",
    });
  };

  public addNewPartChild = (body: EBPartPostBody) => {
    body = omit(body,
      Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES }),
    ) as EBPartPostBody;
    this.newChildApi.set({ body, method: "post" });
  };

  public fetchProposedDocId = (documentTypeId: string) => {
    if (!documentTypeId) { return; }
    this.proposedDocIdApi.set({
      url: FBEndpoint.FetchDocId,
      urlValues: { documentTypeId },
      method: "get",
    });
  };

  public fetchDocumentById = (id: string) => this.documentApi.set({
    url: FBEndpoint.Document,
    urlValues: { id },
    method: "get",
  });

  public fetchDocumentType = (documentTypeId: string) => {
    if (!documentTypeId) { return; }
    this.documentTypeApi.set({
      url: FBEndpoint.FetchDocumentType,
      urlValues: { documentTypeId },
      method: "get",
    });
  };
}

export default FBEBPartState;
