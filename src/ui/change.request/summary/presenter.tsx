import { Box, Grid, ListItem, WithStyles, withStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import { filter } from "lodash";
import React, { useMemo } from "react";
import { Group } from "../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import OwnerChanger from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import ApproversField from "../form/approvers";
import ControlsContainer from "../form/assessmentForm/AssessmentFormControls.container";
import { ChangeRequestFormValues } from "../form/types";
import ApproversSummary from "./approvers";
import Assessment from "./assessment";
import ChangeRequestHeader from "./header";
import ImplementationPlan from "./implementation.plan";
import Justification from "./justification";
import styles from "./styles";

interface OwnProps extends DataProps<ChangeRequest> {
  asyncState: AsyncState;
  canEdit: boolean;
  currentUserEmail: string;
  closeTask: typeof changeRequestsActions.closeTask;
  canChangeOwnerShip: boolean;
  documentTypeGroups: Group[];
}

export type Props = OwnProps &
WithStyles<typeof styles> &
FormikProps<ChangeRequestFormValues>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  asyncState,
  canEdit,
  currentUserEmail,
  closeTask,
  canChangeOwnerShip,
  errors,
  documentTypeGroups,
  values,
}) => {
  const approvedApprovers = useMemo(
    () => filter(dataProp.approvals, ["status", "APPROVED"]),
    [dataProp],
  );

  const approversFieldRenderer = () => (
    <Box>
      <ListItem style={{ display: "inline-block" }}>
        <ApproversField dataProp={approvedApprovers} documentTypeGroups={documentTypeGroups} values={values} />
      </ListItem>
    </Box>
  );

  const submitButtonRenderer = () => (
    <SubmitButton
      asyncState={asyncState}
      label="document.save"
      errors={errors}
    />
  );

  const renderImplementationPlan = dataProp.implementationPlan &&
    (dataProp.implementationPlan.attachments.length > 0 ||
      dataProp.implementationPlan.tasks.length > 0) && (
    <ImplementationPlan
      dataProp={dataProp.implementationPlan}
      currentUserEmail={currentUserEmail}
      crStatus={dataProp.state}
      closeTask={closeTask}
      crId={dataProp.id}
    />
  );

  const renderChangeOwnership = canChangeOwnerShip && (
    <OwnerChanger
      requestId={dataProp.id}
      requestType={RequestType.ChangeRequest}
    />
  );

  return (
    <Box>
      <ChangeRequestHeader dataProp={dataProp} />
      <Grid
        container={true}
        spacing={4}
        direction="column"
        className={classes.previewBox}
      >
        <Grid item={true} xs={12} className={classes.box}>
          <SummaryFieldWithHtml
            label="cr.description"
            value={dataProp.description}
          />
        </Grid>

        <Justification dataProp={dataProp.justifications} />
        <Assessment dataProp={dataProp.assessments} />
        {renderImplementationPlan}
        {canEdit && approversFieldRenderer()}
        <ApproversSummary dataProp={dataProp.approvals} />
      </Grid>
      <Box className={classes.submitBox} p={2}>
        <Grid item={true}>
          {canEdit && <FormProgress asyncState={asyncState} />}
          {canEdit && <FormMessage asyncState={asyncState} />}
          {renderChangeOwnership}
          <ControlsContainer changeRequest={dataProp} errors={errors} />
          {canEdit && submitButtonRenderer()}
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter);
