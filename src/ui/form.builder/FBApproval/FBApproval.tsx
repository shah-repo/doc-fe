import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { isEmpty } from "lodash";
import React from "react";
import { FBApprovalAudit, FBApprovalField, FBApprovalProps, FBApprovalSocket, FBInlineApprovalRole, FBInput, FBText } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { withFBApproval } from "./FBApproval.wrap";

const FBApproval: React.FunctionComponent<FBApprovalProps> = ({
  approvers,
  approverGroups,
  approvalRoles,
  disabled,
  isApproved,
  isDefined,
  approveIsBlocking,
  autosave,
  loading,
  label,
  name,
  type,
  index,
  ...props
}) => (
  // 
  <FBInput {...{ name, disabled, autosave }} type="approval" gutter={false}>
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
            {isApproved && <FBText locale="form.builder.approved" />}
            {!isApproved && (
              <FBText boxProps={{ flexGrow: 1 }} locale="form.builder.approval.waiting" />
            )}
          </Box>
        </Box>
      )}
      {!isEmpty(approvers) && (
        <FBApprovalField<Employee>
          {...props}
          collection={approvers as Employee[]}
          mb={2}
          {...{ disabled }}
        />
      )}
      {!isEmpty(approverGroups) && (
        <FBApprovalField<GroupRequestBody>
          {...props}
          mb={2}
          collection={approverGroups as GroupRequestBody[]}
          {...{ disabled }}
        />
      )}
      {!isEmpty(approvalRoles) && (
        <FBApprovalField<FBInlineApprovalRole>
          {...props}
          mb={2}
          collection={approvalRoles as FBInlineApprovalRole[]}
          {...{ disabled }}
        />
      )}
      <FBApprovalAudit {...{ name, type, index }} />
    </Box>
  </FBInput>
);

export default withFBApproval(FBApproval);
