import {
  Box,
  Button,
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
import Text from "../../components/Text";
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
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
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
  isEditMode,
  setIsEditMode,
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
  const editModeBtnRenderer = () => {
    const handleClick = () => setIsEditMode(!isEditMode);
    return (
      <Button
        onClick={handleClick}
        color="secondary"
        variant="outlined"
      >
        <Text translation={isEditMode ? "common.done.editing" : "common.edit"} />
      </Button>
    );
  };

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
        {isEditMode && canEdit && approversFieldRenderer()}
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
          {isEditMode && canEdit && submitButtonRenderer()}
          {!isEditMode && <ControlsContainer changeRequest={dataProp} />}
          {canEdit && editModeBtnRenderer()}
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter);
