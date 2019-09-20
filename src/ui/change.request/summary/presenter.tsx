import {
  Box,
  Grid,
  ListItem,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import {
  ChangeRequest,
  changeRequestsActions,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import ControlsContainer from "../../changeRequest/forms/assessmentForm/AssessmentFormControls.container";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import ApproversField from "../form/approvers";
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
}

type Props = OwnProps & WithStyles<typeof styles> & FormikProps<ChangeRequestFormValues>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  asyncState,
  canEdit,
  currentUserEmail,
  closeTask,
  errors,
}) => {
  const approversFieldRenderer = () => (
    <Box>
      <ListItem>
        <ApproversField />
      </ListItem>
    </Box>
  );

  const submitButtonRenderer = () => (
    <SubmitButton asyncState={asyncState} label="document.save" errors={errors} />
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
        <ImplementationPlan
          dataProp={dataProp.implementationPlan}
          currentUserEmail={currentUserEmail}
          crStatus={dataProp.state}
          closeTask={closeTask}
          crId={dataProp.id}
        />
        {canEdit && approversFieldRenderer()}
        <ApproversSummary dataProp={dataProp.approvals} />
      </Grid>
      <Box className={classes.submitBox} p={4}>
        <Grid
          item={true}
          container={true}
          alignItems="flex-end"
          direction="column"
        >
          {canEdit && <FormProgress asyncState={asyncState} />}
          {canEdit && <FormMessage asyncState={asyncState} />}
          {canEdit && submitButtonRenderer()}
          <ControlsContainer changeRequest={dataProp} />
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter);
