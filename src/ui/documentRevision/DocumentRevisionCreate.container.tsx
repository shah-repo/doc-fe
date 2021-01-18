import React, { useEffect, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors, FBOutputDocumentType, RevisionChangeType } from "../../state/ducks/documentRevisions";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import { documentsActions, documentsSelectors } from "../../state/ducks/documents";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import useAsync from "../hooks/useAsync";
import { DocumentCloneType } from "./Clone.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionFormValuesForOutput, toDocumentRevisionFormValuesWithRevisionChange, toNewVersionRequestBody } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";

interface DispatchProps {
  create: typeof documentRevisionsActions.create;
  setDocId: typeof documentsActions.setDocumentProposedId;
  loadDocumentProposedId: typeof documentsActions.loadDocumentProposedId;
  loadDocument: typeof documentRevisionsActions.loadDocument;
  loadDocTypes: typeof documentTypeActions.loadList;
}

interface OwnProps {
  documentRevision: DocumentRevision;
  type?: DocumentCloneType;
  isNewVersion: boolean;
}

interface StateProps {
  proposedDocId: string;
}

interface RouteParams {
  docRevId: string;
  pmFormId: string;
  equipmentSection: string;
}

export type DocumentRevisionCreateContainerProps =
  & StateProps
  & OwnProps
  & DispatchProps
  & RouteComponentProps<RouteParams>;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  proposedDocId: documentsSelectors.getProposedDocId(state),
});

export const DEFAULT_INITIAL_VALUES = (): DocumentRevisionFormValues => ({
  name: "",
  description: "",
  attachments: [],
  referenceTo: [],
  revisionChangeType: RevisionChangeType.NextRevision,
  document: {
    docId: "",
    documentType: { id: "" },
  },

  formTemplate: { outputDocumentTypes: [], schema: [] },
  securityGroups: [],
  securityEmployees: [],
  operators: [],
});

export const DocumentRevisionCreateContainer: React.FunctionComponent<DocumentRevisionCreateContainerProps> = ({
  create,
  history,
  documentRevision,
  setDocId,
  type = "none",
  loadDocumentProposedId,
  proposedDocId,
  loadDocument,
  isNewVersion,
  loadDocTypes,
  match,
}) => {
  const dispatch = useDispatch();
  const { pmFormId } = match.params;
  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const isCreateMaintenance = match.path.includes("create_maintenance");
  const pmForm = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, pmFormId || ""));

  const initialValues = useMemo(() => {
    if (type === "newVersion") {
      return toDocumentRevisionFormValuesWithRevisionChange(documentRevision);
    }
    if (type === "newOutput") {
      return toDocumentRevisionFormValuesForOutput(documentRevision);
    }
    if (history.location.state) {
      return toDocumentRevisionFormValuesForOutput(history.location.state);
    }
    return DEFAULT_INITIAL_VALUES();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevision?.id, type, history.location.state]);
  type = history.location.state ?? false ? "newOutput" : type;

  useEffect(() => {
    if (!isCreateMaintenance) {
      return;
    }
    dispatch(documentRevisionsActions.load(pmFormId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateMaintenance]);

  if (isCreateMaintenance) {
    const { docRevId, equipmentSection } = match.params;
    const docType = (pmForm?.formTemplate?.outputDocumentTypes || [])[0] as FBOutputDocumentType;

    if (docType) {
      initialValues.document = {
        ...initialValues.document,
        documentType: docType,
      };
    }
    initialValues.parentEquipment = {
      id: docRevId,
    };
    initialValues.equipmentSection = equipmentSection;
    initialValues.formTemplate = undefined;
    initialValues.formInput = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      equipment_id: docRevId,
    };
    initialValues.formDocument = {
      id: pmFormId,
    };
  }

  const async = useAsync<DocumentRevision>({
    onSuccess: (createdDocumentRevision?) => {
      if (createdDocumentRevision) {
        setDoNotPrompt(true);
        loadDocument(createdDocumentRevision.document.id);
        history.push(
          documentVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
        );
      }
    },
  });

  const onSubmit = (values: DocumentRevisionFormValues) => {
    async.start(create, toNewVersionRequestBody(values), async);
  };

  const showRevisionTypeChange = type === "newVersion" && !!documentRevision;

  useEffect(() => {
    loadDocTypes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DocumentRevisionForm
      asyncState={async.asyncState}
      {...{
        onSubmit,
        initialValues,
        showRevisionTypeChange,
        setDocId,
        doNotPrompt,
        documentRevision,
        loadDocumentProposedId,
        proposedDocId,
        type,
        isNewVersion,
        pmFormId,
        pmForm,
      }}
    />
  );
};

const DocumentRevisionCreateContainerWithRouter = withRouter(DocumentRevisionCreateContainer);

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  create: documentRevisionsActions.create,
  setDocId: documentsActions.setDocumentProposedId,
  loadDocumentProposedId: documentsActions.loadDocumentProposedId,
  loadDocument: documentRevisionsActions.loadDocument,
  loadDocTypes: documentTypeActions.loadList,
})(DocumentRevisionCreateContainerWithRouter);
