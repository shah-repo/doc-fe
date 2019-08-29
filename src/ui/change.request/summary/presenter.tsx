import {
  Box,
  Grid,
  ListItem,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import {
  ChangeRequest,
  changeRequestsActions,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import ControlsContainer from "../../changeRequest/forms/assessmentForm/AssessmentFormControls.container";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
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
        <ApproversField />
      </ListItem>
    </Box>
  );

  const submitButtonRenderer = () => (
    <SubmitButton asyncState={asyncState} label="document.save" />
  );

  return (
    <Box>
      <Box className={classes.previewBox}>
        <Grid container={true} spacing={4} direction="column">
          <Grid item xs={12} className={classes.box}>
            <SummaryFieldWithHtml
              label="cr.description"
              value={dataProp.description}
            />
          </Grid>

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
        </Grid>
        <Grid
          item={true}
          container={true}
          alignItems="flex-end"
          direction="column"
        >
          {canEdit && <FormProgress asyncState={asyncState} />}
          {canEdit && submitButtonRenderer()}
          <ControlsContainer changeRequest={dataProp} />
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter);
