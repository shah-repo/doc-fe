import { Grid, WithStyles, withStyles } from "@material-ui/core";
import { Form, Formik, FormikErrors, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../../state/ducks/auth";
import { Group, GroupTag } from "../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { FormContext } from "../../components/forms/FormContext";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import useAsync from "../../hooks/useAsync";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import SummaryPresenter from "../documentRevision/DocumentRevisionControlPreview.presenter";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "../form/transform";
import { ChangeRequestFormValues } from "../form/types";
import { canChangeCROwner, canEditApprovers, canEditChangeRequest } from "../utils/helpers";
import { changeRequestEditPath } from "../utils/paths";
import { SummaryDispatchProps } from "../utils/types";
import DocumentRevisionLoader from "./loader";
import Presenter from "./presenter";
import ChangeRequestSummarySockets from "./sockets";
import styles from "./styles";

type DispatchProps = SummaryDispatchProps;

interface StateProps {
  currentEmployeeId: string;
  isCompanyAdmin: boolean;
}

interface OwnProps extends DataProps<ChangeRequest> {
  currentUserEmail: string;
}

export type Props =
  OwnProps &
  DispatchProps &
  StateProps &
  WithStyles<typeof styles>;

const selectCanChangeOwnership = authSelectors.makeGetHasTag();
const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentEmployeeId: authSelectors.currentEmployeeId(state),
  isCompanyAdmin: selectCanChangeOwnership(state, GroupTag.USER_MANAGEMENT),
});

export const Container: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  save,
  loadGroupsByStage,
  currentUserEmail,
  closeTask,
  currentEmployeeId,
  isCompanyAdmin,
}) => {
  useDocumentTitle(dataProp.crId);
  const canChangeOwnerShip = canChangeCROwner(dataProp.state, currentEmployeeId, dataProp.owner.id, isCompanyAdmin);
  const [summaryDocumentTypeGroups, setSummaryDocTypeGroups] = useState<any[]>([]);
  const asyncGroups = useAsync({
    onSuccess: (response: Group[] = []) => {
      setSummaryDocTypeGroups([
        ...summaryDocumentTypeGroups,
        response,
      ].flat());
    },
  });

  useEffect(() => {
    dataProp.documentRevisions.map((docRev) => asyncGroups.start(
      loadGroupsByStage,
      docRev.id,
      asyncGroups,
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProp]);

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

  const summaryPresenterRenderer = (
    props: FormikProps<ChangeRequestFormValues>,
  ) => (
    <Form>
      <Presenter
        dataProp={dataProp}
        asyncState={async.asyncState}
        canEdit={canEdit}
        currentUserEmail={currentUserEmail}
        closeTask={closeTask}
        canChangeOwnerShip={canChangeOwnerShip}
        documentTypeGroups={summaryDocumentTypeGroups}
        {...props}
      />
    </Form>
  );

  const validate = (values: ChangeRequestFormValues) => {
    const errors: FormikErrors<any> = {};

    if (!values.approvals || values.approvals.length === 0) {
      errors.approvals = "validators.approversRequired";
    }

    return errors;
  };

  const summaryFormikRenderer = () => (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={toChangeRequestFormValues(dataProp)}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validate={validate}
      >
        {summaryPresenterRenderer}
      </Formik>
    </FormContext.Provider>
  );
  return (
    <Grid
      container={true}
      justify="center"
      spacing={2}
      className={classes.whiteContainer}
    >
      <ChangeRequestSummarySockets crId={dataProp.crId} />
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
          {docRev && <DocumentRevisionLoader documentRevisionId={docRev.id} />}
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

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    save: changeRequestsActions.save,
    closeTask: changeRequestsActions.closeTask,
    loadGroupsByStage: documentRevisionsActions.loadGroupsByStage,
  },
)(withStyles(styles)(Container));
