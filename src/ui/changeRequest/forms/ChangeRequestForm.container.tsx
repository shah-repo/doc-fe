import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  ChangeRequest,
} from "../../../state/ducks/changeRequest";
import {
  DocumentRevision,
} from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import ChangeRequestHeader from "../../change.request/summary/header";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import DocumentRevisionControlContainer from "../documentRevision/DocumentRevisionControl.container";
import DocumentRevisionLoader from "../documentRevision/DocumentRevisionLoader";
import AssessmentFormContainer from "./assessmentForm/AssessmentForm.container";
import styles from "./styles";
import { ChangeRequestFormValues } from "./types";

interface OwnProps {
  initialValues: ChangeRequestFormValues;
  onSubmit: (values: ChangeRequestFormValues) => void;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
}

type ChangeRequestFormContainerProps = OwnProps &
  WithStyles<typeof styles>;

export const ChangeRequestFormContainer: React.FunctionComponent<
  ChangeRequestFormContainerProps
> = ({
  classes,
  onSubmit,
  asyncState,
  initialValues,
  changeRequest,
  doNotPrompt,
}) => {
  const alertMessage = "You have unsaved changes.";
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [selectedDocumentRevision, setSelectedDocumentRevision] = useState<
    string | null
  >(null);
  const [documentRevisionsList, setDocumentRevisionsList] = useState<string[]>(
    initialValues.documentRevisions,
  );
  const [documentsInCrById, setDocumentsInCrById] = useState({});

  useEffect(() => {
    if (changeRequest && changeRequest.documentRevisions) {
      setDocumentsInCrById(
        changeRequest.documentRevisions.reduce(
          (acc, docRev: DocumentRevision) => ({ ...acc, [docRev.id]: docRev }),
          {},
        ),
      );
    }
  }, [(changeRequest || {}).documentRevisions]);

  const doneAddingDocuments = (addedDocuments: string[]) => {
    const documentRevisions = new Set([
      ...addedDocuments,
      ...documentRevisionsList,
    ]);
    setDocumentRevisionsList(Array.from(documentRevisions));
  };

  const deleteDocumentFromChangeRequest = (
    deleteDocumentRevisionId: string,
  ) => {
    setDocumentRevisionsList(
      documentRevisionsList.filter(
        (documentRevisionId) => documentRevisionId !== deleteDocumentRevisionId,
      ),
    );
  };

  const selectDocumentRevision = (documentRevisionId: string) => {
    if (isFormDirty) {
      alert(alertMessage);
      return;
    }
    setSelectedDocumentRevision(documentRevisionId);
  };

  const selectAssessmentForm = () => {
    if (isFormDirty) {
      alert(alertMessage);
      return;
    }
    setSelectedDocumentRevision(null);
  };

  const onDirtyFlagChange = (dirty: boolean) => setIsFormDirty(dirty);

  const renderAssessmentForm = () => {
    return (
      <AssessmentFormContainer
        initialValues={initialValues}
        onSubmit={onSubmit}
        asyncState={asyncState}
        changeRequest={changeRequest}
        documentRevisionsList={documentRevisionsList}
        doNotPrompt={doNotPrompt}
        onDirtyFlagChange={onDirtyFlagChange}
      />
    );
  };

  const renderDocumentRevisionForm = () => {
    if (selectedDocumentRevision) {
      return (
        <DocumentRevisionLoader
          documentRevisionId={selectedDocumentRevision || ""}
          onDirtyFlagChange={onDirtyFlagChange}
        />
      );
    }
  };

  const renderChangeRequestAudit = () => {
    if (changeRequest) {
      return <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />;
    }
  };

  const renderDocumentRevisionAudit = () => {
    if (selectedDocumentRevision) {
      return (
        <DocumentRevisionAuditContainer
          documentRevisionId={selectedDocumentRevision}
        />
      );
    }
  };

  return (
    <Grid container={true} className={classes.whiteContainer}>
      <Grid container={true} spacing={4}>
        <Grid item={true} xs={12} sm={3} md={2}>
          <DocumentRevisionControlContainer
            doneAddingDocuments={doneAddingDocuments}
            documentsInChangeRequest={documentRevisionsList}
            deleteDocumentFromChangeRequest={deleteDocumentFromChangeRequest}
            selectDocumentRevision={selectDocumentRevision}
            selectAssessmentForm={selectAssessmentForm}
            selectedDocumentRevision={selectedDocumentRevision}
            documentsInCrById={documentsInCrById}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6} md={7}>
          {changeRequest && <ChangeRequestHeader dataProp={changeRequest!} />}
          {!selectedDocumentRevision && renderAssessmentForm()}
          {renderDocumentRevisionForm()}
        </Grid>
        <Grid item={true} xs={12} sm={3} md={3}>
          {renderDocumentRevisionAudit()}
          {renderChangeRequestAudit()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ChangeRequestFormContainer);
