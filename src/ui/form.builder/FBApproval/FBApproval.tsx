import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { FBApprovalAudit, FBApprovalField, FBApprovalProps, FBApprovalSocket, FBText } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Text from "../../components/Text";
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
  name,
  type,
  index,
  ...props
}) => (
  <Box mb={3}>
    <FBApprovalSocket />
    {approveIsBlocking && (
      <Box
        py={1}
        mb={3}
        display="flex"
        border={1}
        borderLeft={0}
        borderRight={0}
        borderTop={0}
        borderColor={isApproved ? "#b1d439" : "#e9424a"}
      >
        {isApproved && <CheckCircleIcon style={{ color: "#b1d439" }} />}
        {!isApproved && <ErrorIcon style={{ color: "#e9424a" }} />}
        <Box ml={1} display="flex" mt={0.3}>
          {isApproved && <Text message="form.builder.approved" />}
          {!isApproved && (
            <FBText boxProps={{ flexGrow: 1 }} locale="form.builder.approval.waiting" />
          )}
        </Box>
      </Box>
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
    <FBApprovalAudit {...{ name, type, index }} />
  </Box>
);

export default withFBApproval(FBApproval);
