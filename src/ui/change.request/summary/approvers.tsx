import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Approval, DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import styles from "./styles";

export type Props = DataProps<Approval[]>;

export const Approvers: React.FunctionComponent<Props> = ({ dataProp }) => {
  const classes = styles();

  const approvalRenderer = () => dataProp.map((approval, index) => {
    const { approver, status, reviewedAt } = approval;
    const value = (
      <Box>
        <Typography id="userName" variant="h5" component="span">{approver.user.name}</Typography>
        <Typography id="status-date" variant="h5" component="span">
          {` | ${status}`}
          {reviewedAt && (
            <span>
              {"| "}
              <DateTime value={reviewedAt} />
            </span>
          )}
        </Typography>
      </Box>
    );
    return (
      <SummaryField
        key={`${approval.id}-${index}`}
        value={value}
      />
    );
  });

  return (
    <Box className={classes.box} p={2}>
      <Typography variant="h6">
        <Text translation="common.approvers" />
      </Typography>
      {approvalRenderer()}
    </Box>
  );
};

export default Approvers;
