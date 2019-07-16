import { Box, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { ChangeRequestProps } from "../../../state/ducks/changeRequest";
import { maskId } from "../../../state/ducks/common/helpers";
import ControlsContainer from "../../changeRequest/forms/assessmentForm/AssessmentFormControls.container";
import BaseSummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import Approvers from "./approvers";
import Assessment from "./assessment";
import ImplementationPlan from "./implementation.plan";
import Justification from "./justification";
import styles from "./styles";

type Props = ChangeRequestProps & WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  changeRequest,
}) => {

  return(
    <Box>
      <Box className={classes.previewBox}>
        <ListItem>
          <Typography variant="h5">
            <Text translation="common.crid" />
            {`: CR${maskId(changeRequest.ordinalNumber)}`}
          </Typography>
        </ListItem>
        <BaseSummaryField label="common.owner" value={changeRequest.owner.name} />
        <BaseSummaryField label="common.status" value={changeRequest.state} />
        <BaseSummaryField label="common.description" value={changeRequest.description} />
        <BaseSummaryField label="common.target.date" value={changeRequest.effectiveDate} />
        <Justification justification={changeRequest.justifications} />
        <Assessment assessment={changeRequest.assessments} />
        <ImplementationPlan implementationPlan={changeRequest.implementationPlan} />
        <Approvers approvals={changeRequest.approvals} />
      </Box>
      <Box className={classes.submitBox}>
        <ControlsContainer changeRequest={changeRequest} />
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter) ;
