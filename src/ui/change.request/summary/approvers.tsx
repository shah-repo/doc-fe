import { Box, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { ApprovalsProps } from "../../../state/ducks/common";
import BaseSummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import styles from "./styles";

type Props = ApprovalsProps & WithStyles<typeof styles>;

const Approvers: React.FunctionComponent<Props> = ({
  classes,
  approvals,
}) => {

  const approvalRenderer = () => approvals.map((approval, index) =>
    <BaseSummaryField key={index} label={approval.approver.name} value={approval.status} />);

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.approvers" />:</Typography>
      </ListItem>
      {approvalRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Approvers);
