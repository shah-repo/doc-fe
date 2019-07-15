import { Box, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Approval, DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Approval[]> & WithStyles<typeof styles>;

const Approvers: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  const approvalRenderer = () => dataProp.map((approval, index) =>
    <SummaryField key={index} label={approval.approver.name} value={approval.status} />);

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
