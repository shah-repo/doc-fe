import { debounce, isEmpty, pick } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../common/utils/date";
import { authSelectors } from "../../state/ducks/auth";
import { companyActions, companySelectors } from "../../state/ducks/company";
import { documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus } from "../../state/ducks/documentRevisions/types";
import { FormContext } from "../components/forms/FormContext";
import { compareValuesToSubmit } from "../components/forms/helpers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import { shouldHaveNoResponse } from "../document.revision/utils/helpers";
import { FBEndpoint } from "../form.builder/defaults/FBEndpoint";
import FBStore from "../form.builder/FBStore/FBStore";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { isOperator } from "./DocumentRevisionDisplay.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { canEditDocumentRevision } from "./helpers/documentRevisionPermissions";

interface Props {
  documentId?: string;
  documentRevision: DocumentRevision;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip?: boolean;
  isNewVersion?: boolean;
}
// TO-DO Move To Context Folder
export let documentRevisionStatusContextFromCR = React.createContext<DocumentRevisionStatus | undefined>(undefined);

const DocumentRevisionUpdateContainer: React.FunctionComponent<Props> = ({
  documentRevision,
  onDirtyFlagChange,
  documentId,
  canChangeOwnerShip,
  isNewVersion,
}) => {
  const dispatch = useDispatch();
  const redlineActive = useSelector(companySelectors.getRedlineActive);
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const initialValues = useMemo(() => toDocumentRevisionFormValues(documentRevision), [documentRevision]);
  const isCurrentUserOperator = React.useContext(isOperator);
  const { docId } = documentRevision.document;
  useDocumentTitle(docId);
  const status = documentRevision ? documentRevision.status : undefined;
  documentRevisionStatusContextFromCR = React.createContext(status);
  const saveAction = useActionCreator(documentRevisionsActions.save);
  const saveWithNoResponseAction = useActionCreator(documentRevisionsActions.saveWithNoResponse);


  const [lastSavedTimestamp, setLastSavedTimestamp] = React.useState<string>();

  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      setLastSavedTimestamp(getFormattedDateString(Date.now(), MomentFormats.Time));
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

  const handleSave = (data: DocumentRevisionEditRequestBody, helpers) => {
    async.reset();

    const promise = async.start(
      saveAction,
      documentRevision.id,
      data,
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

  const onSubmit = (values: DocumentRevisionFormValues, helpers, cleanInitialValues) => {
    const dataToSubmit = compareValuesToSubmit(cleanInitialValues, values, toDocumentRevisionEditRequestBody);
    const redlineDataToSubmit = pick(values, "schema", "formInput", "redline");

    if (redlineActive) {
      return handleSave( redlineDataToSubmit as DocumentRevisionEditRequestBody, helpers);
    }

    if (isEmpty(dataToSubmit)) {
      return;
    }

    if (shouldHaveNoResponse(dataToSubmit, documentRevision)) {
      async.reset();
      async.start(
        saveWithNoResponseAction,
        documentRevision.id,
        dataToSubmit as DocumentRevisionEditRequestBody,
        async,
      );
      helpers.resetForm();
      return;
    }

    handleSave(dataToSubmit as DocumentRevisionEditRequestBody, helpers);
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
        {...{ lastSavedTimestamp }}
      />
    </FormContext.Provider>
  );
};

export default DocumentRevisionUpdateContainer;
