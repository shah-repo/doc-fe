import { debounce, isEmpty, pick } from "lodash";
import React, { useEffect, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { companyActions, companySelectors } from "../../state/ducks/company";
import { documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus } from "../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../state/reducers";
import { FormContext } from "../components/forms/FormContext";
import { compareValuesToSubmit } from "../components/forms/helpers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import { FBEndpoint } from "../form.builder/defaults/FBEndpoint";
import FBStore from "../form.builder/FBStore/FBStore";
import useAsync from "../hooks/useAsync";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { isOperator } from "./DocumentRevisionDisplay.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { canEditDocumentRevision } from "./helpers/documentRevisionPermissions";

interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof documentRevisionsActions.save;
}

interface OwnProps {
  documentId?: string;
  documentRevision: DocumentRevision;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip?: boolean;
  isNewVersion?: boolean;
}

type DocumentRevisionUpdateContainerProps = OwnProps &
DispatchProps &
StateProps;

// TO-DO Move To Context Folder
export let documentRevisionStatusContextFromCR = React.createContext< undefined | DocumentRevisionStatus >(undefined);
const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

const DocumentRevisionUpdateContainer: React.FunctionComponent<
DocumentRevisionUpdateContainerProps
> = ({
  save,
  documentRevision,
  currentUserEmail,
  onDirtyFlagChange,
  documentId,
  canChangeOwnerShip,
  isNewVersion,
}) => {
  const dispatch = useDispatch();
  const redlineActive = useSelector(companySelectors.getRedlineActive);
  const initialValues = useMemo(() => toDocumentRevisionFormValues(documentRevision), [documentRevision]);
  const isCurrentUserOperator = React.useContext(isOperator);
  const { docId } = documentRevision.document;
  useDocumentTitle(docId);
  const status = documentRevision ? documentRevision.status : undefined;
  documentRevisionStatusContextFromCR = React.createContext(status);

  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      if (redlineActive) {
        dispatch(companyActions.redlineConfig());
      }
      setDoNotPrompt(true);
    },
  });

  useEffect(() => () => {
    documentRevisionStatusContextFromCR = React.createContext<undefined | DocumentRevisionStatus>(undefined);
  }, []);

  if (!(canEditDocumentRevision(documentRevision, currentUserEmail, isCurrentUserOperator) )) {
    return (
      <DocumentRevisionSummaryPresenter
        dataProp={documentRevision}
        canShowCreateVersionButton={true}
        canChangeOwnerShip={canChangeOwnerShip}
      />
    );
  }

  const onSubmit = (values: DocumentRevisionFormValues, helpers, cleanInitialValues) => {
    const dataToSubmit = compareValuesToSubmit(cleanInitialValues, values, toDocumentRevisionEditRequestBody);

    if (redlineActive) {
      async.reset();

      const promise = async.start(
        save,
        documentRevision.id,
        pick(values, "schema", "formInput") as DocumentRevisionEditRequestBody,
        async,
      );
      // workaround when editing document through CR view. The form is marked dirty when editing FB fields
      promise?.then(() => {
        FBStore.audit.set({
          url: FBEndpoint.DocumentRevisionAudit,
          urlValues: { documentId: documentRevision.id },
          method: "get",
        });
        helpers.resetForm();
      });
    }

    if (isEmpty(dataToSubmit)) {
      return;
    }
    async.reset();

    const promise = async.start(
      save,
      documentRevision.id,
      dataToSubmit as DocumentRevisionEditRequestBody,
      async,
    );
    // workaround when editing document through CR view. The form is marked dirty when editing FB fields
    promise?.then(() => {
      FBStore.audit.set({
        url: FBEndpoint.DocumentRevisionAudit,
        urlValues: { documentId: documentRevision.id },
        method: "get",
      });
      helpers.resetForm();
    });
  };

  const debouncedSubmit = debounce(onSubmit, 1000);

  return (
    <FormContext.Provider value={{ submitOnChange: true }}>
      <DocumentRevisionForm
        doNotPrompt={doNotPrompt}
        asyncState={async.asyncState}
        onSubmit={debouncedSubmit}
        initialValues={initialValues}
        onDirtyFlagChange={onDirtyFlagChange}
        documentRevision={documentRevision}
        canChangeOwnerShip={canChangeOwnerShip}
        showRevisionTypeChange
        isNewVersion={isNewVersion}
      />
    </FormContext.Provider>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    save: documentRevisionsActions.save,
  },
)(DocumentRevisionUpdateContainer);
