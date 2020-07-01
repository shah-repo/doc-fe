import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { FBApprovalAudit, FBApprovalField, FBApprovalProps, FBApprovalSocket } from "..";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Text from "../../components/Text";
import { FBDialogState } from "../FBDialog";
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
  dialogState,
  onClick,
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
            <>
              <Box flexGrow={1}>
                <Text message="form.builder.approval.waiting" />
              </Box>
              {/* <Text message="form.builder.approval.condition" /> */}
            </>
          )}
        </Box>
      </Box>
    )}
    {/* {isDefined && (
      <Typography variant="button" display="block" style={{ color: "rgb(120, 138, 156)" }}>
        {<Text message={label as string} />}
        {loading && (
          <Box ml={1} component="span">
            <CircularProgress size={16} />
          </Box>
        )}
      </Typography>
    )} */}
    {approvers && (
      <FBApprovalField<Employee>
        {...props}
        collection={approvers as Employee[]}
        dialogState={dialogState as FBDialogState}
        onClick={onClick as () => void}
        {...{ disabled }}
      />
    )}
    {approverGroups && (
      <FBApprovalField<GroupRequestBody>
        {...props}
        mt={approvers ? 2 : 0}
        collection={approverGroups as GroupRequestBody[]}
        dialogState={dialogState as FBDialogState}
        onClick={onClick as () => void}
        {...{ disabled }}
      />
    )}
    <FBApprovalAudit {...{ name, type, index }} />
  </Box>
);

export default withFBApproval(FBApproval);
