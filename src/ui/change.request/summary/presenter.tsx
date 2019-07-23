import { Box, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import ControlsContainer from "../../changeRequest/forms/assessmentForm/AssessmentFormControls.container";
import SummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import Approvers from "./approvers";
import Assessment from "./assessment";
import ImplementationPlan from "./implementation.plan";
import Justification from "./justification";
import styles from "./styles";

type Props = DataProps<ChangeRequest> & WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  return(
    <Box>
      <Box className={classes.previewBox}>
        <ListItem>
          <Typography variant="h5">
            <Text translation="common.crid" />: {dataProp.crId}
          </Typography>
        </ListItem>
        <SummaryField label="common.owner" value={dataProp.owner.name} />
        <SummaryField label="common.status" value={dataProp.state} />
        <SummaryField label="common.title" value={dataProp.title} />
        <SummaryField label="common.description" value={dataProp.description} />
        <SummaryField label="common.target.date" value={dataProp.effectiveDate} />
        <Justification dataProp={dataProp.justifications} />
        <Assessment dataProp={dataProp.assessments} />
        <ImplementationPlan dataProp={dataProp.implementationPlan} />
        <Approvers dataProp={dataProp.approvals} />
      </Box>
      <Box className={classes.submitBox}>
        <ControlsContainer changeRequest={dataProp} />
      </Box>
    </Box >
  );
};

export default withStyles(styles)(Presenter);
