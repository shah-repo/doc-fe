import { Box } from "@material-ui/core";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { Approval } from "../../../../state/ducks/common/types";
import DateTime from "../../../components/DateTime";
import Text from "../../../components/Text";

interface Props {
  approvals?: Approval[];
}

const POAssignedDate: React.FunctionComponent<Props> = ({
  approvals = [],
}) => {
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const assignedAt = useMemo(() =>
    approvals.find((a) => a.approver.id === currentEmployeeId)?.assignedAt
  , [currentEmployeeId, approvals]);
  return (
    <Box marginBottom="5px">
      <Box component="span" fontWeight="fontWeightBold">
        <Text translation="common.assigned.date" />
        {": "}
      </Box>
      <Box component="span">
        {assignedAt && <DateTime value={assignedAt} />}
      </Box>
    </Box>
  );
};

export default POAssignedDate;
