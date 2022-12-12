import { BoxProps } from "@material-ui/core";
import { FormikProps } from "formik";
import { SMFormStateProps, SMProviderProps, SMTabsHOCProps } from "../../..";
import { Id } from "../../../../state/ducks/common/types";
import { DocumentType, DocumentTypeByIdState } from "../../../../state/ducks/documentRevisions/documentType/types";
import { Document, DocumentRevision, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../../state/ducks/documents";
import { DocumentCloneType } from "../../../../ui/documentRevision/Clone.container";
import { DocumentRevisionFormValues } from "../../../../ui/documentRevision/forms/types";
import { FBSchemaProps, FBWorkspaceMode, FBWorkspaceState } from "../../../../ui/form.builder";

export interface DocumentInfo {
  name: string;
  isQms: boolean;
  needsSignature: boolean;
}

export type DocumentRevisionFormProps =
& Pick<SMProviderProps, "_formState" | "_documentRevisionFormState">
& SMTabsHOCProps
& Pick<BoxProps, "onScroll">
& {
  setDocId?: typeof documentsActions.setDocumentProposedId;
  onDirtyFlagChange?: ((dirty: boolean) => void);
  documentRevision: DocumentRevision;
  bannerPortal: React.MutableRefObject<null>;
  shouldShowUpgrade: boolean;
  type?: DocumentCloneType;
  isDisabled: boolean;
  formValues: FormikProps<DocumentRevisionFormValues>;
  documentRevisions?: DocumentRevision[];
  showRevisionTypeChange?: boolean;
  proposedDocId?: string;
  doNotPrompt?: boolean;
  documentTypesById: DocumentTypeByIdState;
  canChangeOwnerShip: boolean;
  isNewVersion?: boolean;
  showAdministrativeAndVoidChange: boolean;
  document?: Document;
  redlineActive: boolean;
  isOutput: boolean;
  email: string;
  isOwner: boolean;
  schema: FBSchemaProps[];
  formInput?: Record<string, any>;
  autosaveEnabled: boolean;
  mode: FBWorkspaceMode;
  workspaceState?: FBWorkspaceState;
  isCreateUrl?: boolean;
  isDAM?: boolean;
};

export interface DocumentRevisionFormStateProps {
  setDocumentRevisionChangeType: (revisionChangeType: RevisionChangeType) => void;
  setCreateDocumentDisabled: (disabled?: boolean) => void;
  setReleasedDocRev: (releasedDocRev?: DocumentRevision) => void;
  setDocInfo: (docInfo: DocumentInfo) => void;
  setForceRender: (forceRender: any) => void;
  setDocumentRevision: (documentRevision?: DocumentRevision) => void;
  setScrollOffset: (offset: number) => void;
  setIsHeaderHidden: (isHidden: boolean) => void;
  setFormMode: SMFormStateProps["setMode"];
  setFormAutosave: SMFormStateProps["setAutosave"];
  setDisabledAction: (disabledAction: boolean) =>  void;
  setLeftPanelOpen: () => void;
  isHeaderHidden: boolean;
  documentRevision?: DocumentRevision;
  revisionChangeType?: RevisionChangeType;
  createDocumentDisabled: boolean;
  releasedDocRev?: DocumentRevision;
  docInfo: DocumentInfo;
  forceRender?: any;
  docId?: string;
  documentId?: string;
  documentType?: Partial<DocumentType>;
  documentTypeAcronym: string;
  documentTypeId: string;
  scrollOffset: any;
  formMode: SMFormStateProps["mode"];
  formAutosave: SMFormStateProps["autosave"];
  disabledAction: boolean;
  loading: boolean;
  id?: string;
  formSchema: FBSchemaProps[];
  referenceValue: Id[];
  schema: FBSchemaProps[];
  leftPanelOpen: boolean;
}
