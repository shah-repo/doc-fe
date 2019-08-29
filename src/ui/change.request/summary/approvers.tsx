import {
  Box,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { getFormattedDateString } from "../../../common/utils/date";
import { Approval, DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Approval[]> & WithStyles<typeof styles>;

const Approvers: React.FunctionComponent<Props> = ({ classes, dataProp }) => {
  const approvalRenderer = () => dataProp.map((approval, index) => {
    const { approver, status, reviewedAt } = approval;
    const value = (
      <Box>
        {status}
        {reviewedAt && <Text message={`, ${getFormattedDateString(reviewedAt)}`} />}
      </Box>
    );
    return (
      <SummaryField
        key={`${approval.id}-${index}`}
        label={approver.name}
        value={value}
      />
    );
  });

  return (
    <Box className={classes.box} p={4}>
      <Typography variant="h6">
        <Text translation="common.approvers" />
      </Typography>
      {approvalRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Approvers);
