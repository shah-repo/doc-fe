import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { isEmpty } from "lodash";
import React from "react";
import { FBApprovalAudit, FBApprovalField, FBApprovalProps, FBApprovalSocket, FBInlineApprovalRole, FBInput, FBText } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Colors from "../../layout/theme/utils/colors";
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
  gutter,
  ...props
}) => (
  <FBInput {...{ name, disabled, autosave, gutter }} type="approval">
    <FBApprovalSocket />
    {approveIsBlocking && (
      <Box
        py={1}
        display="flex"
        border={1}
        borderLeft={0}
        borderRight={0}
        borderTop={0}
        borderColor={isApproved ? Colors.green : Colors.red}
      >
        {isApproved && <CheckCircleIcon style={{ color: Colors.green }} />}
        {!isApproved && <ErrorIcon style={{ color: Colors.red }} />}
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
        {...{ disabled }}
        collection={approvers as Employee[]}
      />
    )}
    {!isEmpty(approverGroups) && (
      <FBApprovalField<GroupRequestBody>
        {...props}
        {...{ disabled }}
        collection={approverGroups as GroupRequestBody[]}
      />
    )}
    {!isEmpty(approvalRoles) && (
      <FBApprovalField<FBInlineApprovalRole>
        {...props}
        {...{ disabled }}
        collection={approvalRoles as FBInlineApprovalRole[]}
      />
    )}
    <FBApprovalAudit {...{ name, type, index }} />
  </FBInput>
);

export default withFBApproval(FBApproval);
