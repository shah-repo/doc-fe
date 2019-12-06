import { Grid } from "@material-ui/core";
import React from "react";
import {
  ChangeRequest,
} from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";
import ChangeRequestHeader from "../../change.request/summary/header";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import DocumentRevisionLoader from "../documentRevision/DocumentRevisionLoader";
import AssessmentFormContainer from "./assessmentForm/AssessmentForm.container";
import { ChangeRequestFormValues } from "./types";

interface OwnProps {
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  selectedDocumentRevision: string | null;
  documentRevisionsList: string[];
  onDirtyFlagChange: (dirty: boolean) => void;
  onSubmit: (values: ChangeRequestFormValues) => void;
}

type ChangeRequestFormPresenterProps = OwnProps;

export const ChangeRequestFormPresenter: React.FunctionComponent<
  ChangeRequestFormPresenterProps
> = ({
  initialValues,
  onSubmit,
  asyncState,
  changeRequest,
  documentRevisionsList,
  doNotPrompt,
  onDirtyFlagChange,
  selectedDocumentRevision,
}) => {
    const renderAssessmentForm = (
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

    const renderDocumentRevisionForm = selectedDocumentRevision && (
      <DocumentRevisionLoader
        documentRevisionId={selectedDocumentRevision || ""}
        onDirtyFlagChange={onDirtyFlagChange}
      />
    );

    const renderChangeRequestAudit = changeRequest &&
      <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />;

    const renderDocumentRevisionAudit = selectedDocumentRevision && (
      <DocumentRevisionAuditContainer
        documentRevisionId={selectedDocumentRevision}
      />
    );

    return (
      <>
        <Grid item={true} xs={12} sm={6} md={7}>
          {changeRequest && !selectedDocumentRevision && <ChangeRequestHeader dataProp={changeRequest!} />}
          {!selectedDocumentRevision && renderAssessmentForm}
          {renderDocumentRevisionForm}
        </Grid>
        <Grid item={true} xs={12} sm={3} md={3}>
          {renderDocumentRevisionAudit}
          {renderChangeRequestAudit}
        </Grid>
      </>
    );
  };

export default ChangeRequestFormPresenter;
