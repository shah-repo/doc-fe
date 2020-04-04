import { Box, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import React from "react";
import { FBApprovalProps } from ".";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Text from "../../components/Text";
import FBButton from "../components/inputs/FBButton";
import FBApprovalField from "./FBApproval.field";
import { withFBApproval } from "./FBApproval.wrap";

const FBApproval: React.FunctionComponent<FBApprovalProps> = ({
  approvers,
  approverGroups,
  disabled,
  isApproved,
  isDefined,
  approveIsBlocking,
  label,
  ...props
}) => (
  <Box mb={3}>
    {isDefined && (
      <Typography variant="button" display="block" style={{ color: "rgb(120, 138, 156)" }}>
        {label}
      </Typography>
    )}
    {approvers && (
      <FBApprovalField<Employee>
        {...props}
        collection={approvers}
        {...{ disabled }}
      />
    )}
    {approverGroups && (
      <FBApprovalField<GroupRequestBody>
        {...props}
        mt={approvers ? 2 : 0}
        collection={approverGroups}
        {...{ disabled }}
      />
    )}
    {!isDefined && <FBButton {...{ disabled }} />}
    {approveIsBlocking && (
      <Box
        mt={4}
        justifyContent="center"
        alignItems="center"
        component="span"
        display="flex"
        p={1.5}
        borderRadius={3}
        bgcolor={isApproved ? "green" : "error.main"}
        color="white"
      >
        {isApproved && <CheckCircleIcon />}
        {!isApproved && <WarningIcon />}
        <Box ml={1}>
          {isApproved && <Text message="form.builder.approved" />}
          {!isApproved && <Text message="form.builder.approval.waiting" />}
        </Box>
      </Box>
    )}
  </Box>
);

export default withFBApproval(FBApproval);
