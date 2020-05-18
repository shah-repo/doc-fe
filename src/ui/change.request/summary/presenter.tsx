import { Box, Grid, ListItem, WithStyles, withStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import { filter } from "lodash";
import React, { useMemo } from "react";
import { Group } from "../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import ApproversField from "../form/approvers";
import { ChangeRequestFormValues } from "../form/types";
import ApproversSummary from "./approvers";
import Assessment from "./assessment";
import ImplementationPlan from "./implementation.plan";
import Justification from "./justification";
import styles from "./styles";
import SummaryHeader from "./SummaryHeader";

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


  return (
    <Box>
      <SummaryHeader
        {...{
          dataProp,
          canChangeOwnerShip,
          asyncState,
          errors,
          canEdit,
        }}
      />
      <Grid
        container={true}
        spacing={4}
        direction="column"
        className={classes.previewBox}
      >
        {canEdit && <FormProgress asyncState={asyncState} />}
        {canEdit && <FormMessage asyncState={asyncState} />}
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
    </Box>
  );
};

export default withStyles(styles)(Presenter);
