import {
  Box,
  Grid,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import moment from "moment";
import React from "react";
import { ChangeRequest, changeRequestsActions } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import ControlsContainer from "../../changeRequest/forms/assessmentForm/AssessmentFormControls.container";
import SummaryField from "../../common/summary/base";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import ApproversField from "../form/approvers";
import ApproversSummary from "./approvers";
import Assessment from "./assessment";
import ImplementationPlan from "./implementation.plan";
import Justification from "./justification";
import styles from "./styles";

interface OwnProps extends DataProps<ChangeRequest> {
  asyncState: AsyncState;
  canEdit: boolean;
  currentUserEmail: string;
  closeTask: typeof changeRequestsActions.closeTask;
}

type Props = OwnProps & WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  asyncState,
  canEdit,
  currentUserEmail,
  closeTask,
}) => {

  const approversFieldRenderer = () => (
    <Box>
      <ListItem>
        <Typography variant="h6"><Text translation="common.approvers" />:</Typography>
      </ListItem>
      <ListItem><ApproversField /></ListItem>
    </Box>
  );

  const submitButtonRenderer = () =>
    <SubmitButton asyncState={asyncState} label="document.save" />;

  return (
    <Box>
      <Box className={classes.previewBox}>
        <ListItem>
          <Typography variant="h5">
            <Text translation="common.crid" />: {dataProp.crId}
          </Typography>
        </ListItem>
        <SummaryField label="common.owner" value={dataProp.owner.name} />
        <SummaryField label="common.status" value={dataProp.state} />
        <SummaryField label="cr.title" value={dataProp.title} />
        <SummaryField label="cr.description" value={dataProp.description} />
        <SummaryField
          label="common.target.date"
          value={moment.utc(dataProp.effectiveDate).format("LL")}
        />
        <Justification dataProp={dataProp.justifications} />
        <Assessment dataProp={dataProp.assessments} />
        <ImplementationPlan
          dataProp={dataProp.implementationPlan}
          currentUserEmail={currentUserEmail}
          crStatus={dataProp.state}
          closeTask={closeTask}
          crId={dataProp.id}
        />
        {canEdit && approversFieldRenderer()}
        {!canEdit && <ApproversSummary dataProp={dataProp.approvals} />}
      </Box>
      <Box className={classes.submitBox}>
        <Grid item={true} container={true} alignItems="flex-end" direction="column">
          <div>
            {canEdit && <FormProgress asyncState={asyncState} />}
            {canEdit && submitButtonRenderer()}
            <ControlsContainer changeRequest={dataProp} />
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter);
