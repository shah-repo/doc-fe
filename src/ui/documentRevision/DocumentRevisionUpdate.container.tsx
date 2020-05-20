import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { DocumentRevision, DocumentRevisionEditRequestBody, documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { FormContext } from "../components/forms/FormContext";
import { compareValuesToSubmit } from "../components/forms/helpers";
import DocumentRevisionSummaryPresenter from "../document.revision/summary/presenter";
import useAsync from "../hooks/useAsync";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { isOperator } from "./DocumentRevisionDisplay.container";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { toDocumentRevisionEditRequestBody, toDocumentRevisionFormValues } from "./forms/transform";
import { DocumentRevisionFormValues } from "./forms/types";
import { canEditDocumentRevision } from "./helpers";

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
}

export type DocumentRevisionUpdateContainerProps = OwnProps &
DispatchProps &
StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const DocumentRevisionUpdateContainer: React.FunctionComponent<
DocumentRevisionUpdateContainerProps
> = ({
  save,
  documentRevision,
  currentUserEmail,
  onDirtyFlagChange,
  documentId,
  canChangeOwnerShip,
}) => {

  const initialValues = useMemo(() => toDocumentRevisionFormValues(documentRevision), [documentRevision]);
  const isCurrentUserOperator = React.useContext(isOperator);
  const { docId } = documentRevision.document;
  useDocumentTitle(docId);

  const [doNotPrompt, setDoNotPrompt] = React.useState(false);
  const async = useAsync<DocumentRevision>({
    onSuccess: () => {
      setDoNotPrompt(true);
    },
  });

  if (!(canEditDocumentRevision(documentRevision, currentUserEmail) || isCurrentUserOperator )) {
    return (
      <DocumentRevisionSummaryPresenter
        dataProp={documentRevision}
        canShowCreateVersionButton={true}
        canChangeOwnerShip={canChangeOwnerShip}
      />
    );
  }

  const onSubmit = (values: DocumentRevisionFormValues) => {
    const dataToSubmit = compareValuesToSubmit(initialValues, values, toDocumentRevisionEditRequestBody);

    if (isEmpty(dataToSubmit)) {
      return;
    }

    async.reset();

    async.start(
      save,
      documentRevision.id,
      dataToSubmit as DocumentRevisionEditRequestBody,
      async,
    );
  };

  return (
    <FormContext.Provider value={{ submitOnChange: true }}>
      <DocumentRevisionForm
        doNotPrompt={doNotPrompt}
        asyncState={async.asyncState}
        onSubmit={onSubmit}
        initialValues={initialValues}
        onDirtyFlagChange={onDirtyFlagChange}
        documentRevision={documentRevision}
        canChangeOwnerShip={canChangeOwnerShip}
        showRevisionTypeChange
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
