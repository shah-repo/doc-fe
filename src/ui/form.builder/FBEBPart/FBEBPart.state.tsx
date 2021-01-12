import { action, observable, set } from "mobx";
import { EBPartPatchBody, EBPartPostBody, ProposedDocIdBody } from ".";
import { FBOption } from "..";
import { DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType/types";
import { Document, DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBEBPartState extends FBRequest<null | DocumentRevision | ProposedDocIdBody | Document | DocumentTypeById, EBPartPatchBody | EBPartPostBody | null> {
  // MARK: @observables
  @observable public childrenParts?: string;
  @observable public childrenPartsForRevise?: string;
  @observable public formOptions?: FBOption[];

  // MARK: @config

  // MARK: @api
  public existingChildApi = new FBRequest<null, EBPartPatchBody>(FBEndpoint.PatchDocumentRevision);
  public newChildApi = new FBRequest<DocumentRevision, EBPartPostBody>(FBEndpoint.DocumentRevisionsUrl);
  public proposedDocIdApi = new FBRequest<ProposedDocIdBody, null>(FBEndpoint.FetchDocId);
  public documentApi = new FBRequest<Document, null>(FBEndpoint.Document);
  public documentTypeApi = new FBRequest<DocumentTypeById, null>(FBEndpoint.FetchDocumentType);

  // MARK: @constructor
  public constructor(children: { childrenParts?: string; childrenPartsForRevise?: string }) {
    super();
    this.childrenParts = children.childrenParts;
    this.childrenPartsForRevise = children.childrenPartsForRevise;
  }

  // MARK: @actions
  @action public setChildrenParts = (childrenParts?: string) =>
    set(this, "childrenParts", childrenParts);

  // MARK: @helpers
  public addExistingPartChild = (docRevId?: string, body?: EBPartPatchBody) => {
    if (!docRevId) { return; }
    this.existingChildApi.set({
      url: FBEndpoint.PatchDocumentRevision,
      urlValues: { docRevId },
      body,
      method: "patch",
    });
  };

  public addNewPartChild = (body: EBPartPostBody) => {
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

  public fetchFormsForDocType = async (documentTypeId: string) => {
    this.setFormOptions([]);
    if (!documentTypeId) { return; }
    this.documentTypeApi.set({
      url: FBEndpoint.FetchDocumentType,
      urlValues: { documentTypeId },
    });
    this.loading = true;
    const data = await this.documentTypeApi.fetch();
    if (!data?.forms) {
      this.loading = false;
      return;
    }
    this.setFormOptions(data.forms);
  };

  private setFormOptions = (forms: DocumentRevision[]) => {
    if (!forms) { return; }
    this.formOptions = forms?.map((form) => ({
      value: form.id,
      text: form.name,
    }));
    this.loading = false;
  };
}

export default FBEBPartState;
