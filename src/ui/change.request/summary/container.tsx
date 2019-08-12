import { Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import {
  ChangeRequest,
  changeRequestsActions,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import ChangeRequestAuditContainer from "../../changeRequest/audit/Audit.container";
import SummaryPresenter from "../../changeRequest/documentRevision/DocumentRevisionControlPreview.presenter";
import {
  toChangeRequestEditRequestBody,
  toChangeRequestFormValues,
} from "../../changeRequest/forms/transform";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import DocumentRevisionSummaryPresenter from "../../document.revision/summary/presenter";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import useAsync from "../../hooks/useAsync";
import { canEditApprovers } from "../utils/helpers";
import { SummaryDispatchProps } from "../utils/types";
import Presenter from "./presenter";

type DispatchProps = SummaryDispatchProps;

interface OwnProps extends DataProps<ChangeRequest> {
  currentUserEmail: string;
}

type Props = OwnProps & DispatchProps;

export const Container: React.FunctionComponent<Props> = ({
  dataProp,
  save,
  currentUserEmail,
  closeTask,
}) => {
  const [docRev, setDocRev] = React.useState<DocumentRevision | null>(null);

  const docRevSummary = (documentRevision: DocumentRevision) =>
    setDocRev(documentRevision);
  const crSummary = () => setDocRev(null);

  const canEdit = canEditApprovers({ dataProp, currentUserEmail });
  const async = useAsync<ChangeRequest>();

  const onSubmit = (values: ChangeRequestFormValues) => {
    async.start(
      save,
      dataProp.id,
      toChangeRequestEditRequestBody(values),
      async,
    );
  };

  const summaryPresenterRenderer = () => (
    <Form>
      <Presenter
        dataProp={dataProp}
        asyncState={async.asyncState}
        canEdit={canEdit}
        currentUserEmail={currentUserEmail}
        closeTask={closeTask}
      />
    </Form>
  );

  const summaryFormikRenderer = () => (
    <Formik
      render={summaryPresenterRenderer}
      initialValues={toChangeRequestFormValues(dataProp)}
      onSubmit={onSubmit}
      enableReinitialize={true}
    />
  );
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={3}>
        <SummaryPresenter
          documentsInChangeRequest={dataProp.documentRevisions}
          selectAssessmentForm={crSummary}
          selectDocumentRevision={docRevSummary}
          selectedDocumentRevision={docRev ? docRev.id : null}
        />
      </Grid>
      <Grid item={true} xs={6}>
        {docRev && <DocumentRevisionSummaryPresenter dataProp={docRev} />}
        {!docRev && summaryFormikRenderer()}
      </Grid>
      <Grid item={true} xs={3}>
        {docRev && (
          <DocumentRevisionAuditContainer documentRevisionId={docRev.id} />
        )}
        {dataProp && (
          <ChangeRequestAuditContainer changeRequestId={dataProp.id} />
        )}
      </Grid>
    </Grid>
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(
  null,
  {
    save: changeRequestsActions.save,
    closeTask: changeRequestsActions.closeTask,
  })(Container);
