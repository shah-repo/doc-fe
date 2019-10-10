import { Grid, WithStyles, withStyles } from "@material-ui/core";
import { Form, Formik, FormikErrors, FormikProps } from "formik";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
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
import { canEditApprovers, canEditChangeRequest } from "../utils/helpers";
import { changeRequestEditPath } from "../utils/paths";
import { SummaryDispatchProps } from "../utils/types";
import Presenter from "./presenter";
import styles from "./styles";

type DispatchProps = SummaryDispatchProps;

interface OwnProps extends DataProps<ChangeRequest> {
  currentUserEmail: string;
}

type Props = OwnProps & DispatchProps & WithStyles<typeof styles>;

export const Container: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  save,
  currentUserEmail,
  closeTask,
}) => {
  const [docRev, setDocRev] = React.useState<DocumentRevision | null>(null);
  const async = useAsync<ChangeRequest>();
  if (canEditChangeRequest({ dataProp, currentUserEmail })) {
    return <Redirect to={changeRequestEditPath(dataProp.id)} />;
  }

  const docRevSummary = (documentRevision: DocumentRevision) =>
    setDocRev(documentRevision);
  const crSummary = () => setDocRev(null);

  const canEdit = canEditApprovers({ dataProp, currentUserEmail });

  const onSubmit = (values: ChangeRequestFormValues) => {
    async.start(
      save,
      dataProp.id,
      toChangeRequestEditRequestBody(values),
      async,
    );
  };

  const summaryPresenterRenderer = (props: FormikProps<ChangeRequestFormValues>) => (
    <Form>
      <Presenter
        dataProp={dataProp}
        asyncState={async.asyncState}
        canEdit={canEdit}
        currentUserEmail={currentUserEmail}
        closeTask={closeTask}
        {...props}
      />
    </Form>
  );

  const validate = (values: ChangeRequestFormValues) => {
    const errors: FormikErrors<any> = {};

    if (values.approvals.length === 0) {
      errors.approvals = "validators.approversRequired";
    }

    return errors;
  };

  const summaryFormikRenderer = () => (
    <Formik
      render={summaryPresenterRenderer}
      initialValues={toChangeRequestFormValues(dataProp)}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validate={validate}
    />
  );
  return (
    <Grid
      container={true}
      justify="center"
      spacing={2}
      className={classes.whiteContainer}
    >
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={2} className={classes.sidebar}>
          <SummaryPresenter
            documentsInChangeRequest={dataProp.documentRevisions}
            selectAssessmentForm={crSummary}
            selectDocumentRevision={docRevSummary}
            selectedDocumentRevision={docRev ? docRev.id : null}
          />
        </Grid>
        <Grid item={true} xs={7} className={classes.root}>
          {docRev && (
            <DocumentRevisionSummaryPresenter
              dataProp={{ ...docRev, changeRequest: dataProp }}
            />
          )}
          {!docRev && summaryFormikRenderer()}
        </Grid>
        <Grid item={true} xs={3} className={classes.sidebar}>
          {docRev && (
            <DocumentRevisionAuditContainer documentRevisionId={docRev.id} />
          )}
          {dataProp && (
            <ChangeRequestAuditContainer changeRequestId={dataProp.id} />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

Container.displayName = "ChangeRequestSummaryContainer";

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(
  null,
  {
    save: changeRequestsActions.save,
    closeTask: changeRequestsActions.closeTask,
  },
)(withStyles(styles)(Container));
