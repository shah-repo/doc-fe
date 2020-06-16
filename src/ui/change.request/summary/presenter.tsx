import { Box, Grid, ListItem } from "@material-ui/core";
import { FormikProps } from "formik";
import { filter } from "lodash";
import React, { useMemo } from "react";
import { Group } from "../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import ApproversField from "../form/approvers";
import { ChangeRequestFormValues } from "../form/types";
import ApproversSummary from "./approvers";
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

export type Props = OwnProps & FormikProps<ChangeRequestFormValues>;

export const Presenter: React.FunctionComponent<Props> = ({
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
  const classes = styles();

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
        <SummaryField
          label="common.title"
          value={dataProp.title}
        />
        <SummaryFieldWithHtml
          label="common.description"
          value={dataProp.description}
        />
        {canEdit && approversFieldRenderer()}
        <ApproversSummary dataProp={dataProp.approvals} />
      </Grid>
    </Box>
  );
};

export default Presenter;
