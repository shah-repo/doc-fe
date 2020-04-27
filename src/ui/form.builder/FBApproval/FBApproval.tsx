import { Box, CircularProgress, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import React from "react";
import { FBApprovalProps, FBApprovalSocket } from ".";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Text from "../../components/Text";
import FBApprovalField from "./FBApproval.field";
import { withFBApproval } from "./FBApproval.wrap";

const FBApproval: React.FunctionComponent<FBApprovalProps> = ({
  approvers,
  approverGroups,
  disabled,
  isApproved,
  isDefined,
  approveIsBlocking,
  loading,
  label,
  ...props
}) => (
  <Box mb={3}>
    <FBApprovalSocket />
    {isDefined && (
      <Typography variant="button" display="block" style={{ color: "rgb(120, 138, 156)" }}>
        {label}
        {loading && (
          <Box ml={1} component="span">
            <CircularProgress size={16} />
          </Box>
        )}
      </Typography>
    )}
    {approvers && (
      <FBApprovalField<Employee>
        {...props}
        collection={approvers as Employee[]}
        {...{ disabled }}
      />
    )}
    {approverGroups && (
      <FBApprovalField<GroupRequestBody>
        {...props}
        mt={approvers ? 2 : 0}
        collection={approverGroups as GroupRequestBody[]}
        {...{ disabled }}
      />
    )}
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
