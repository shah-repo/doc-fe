import { Box, Typography } from "@material-ui/core";
import React from "react";
import { FBApprovalFieldProps } from ".";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Text from "../../components/Text";
import FBButton from "../components/inputs/FBButton";
import FBMapWrapper from "../FBMapWrapper";
import { withFBApprovalField } from "./FBApprovalField.wrap";

const FBApprovalField: React.FunctionComponent<FBApprovalFieldProps> = ({
  type,
  approvers,
  currentUser,
  canApprove,
  approverStatus,
  approverGroups,
  onClick,
  disabled,
  ...props
}) => (
  <Box mb={3}>
    {approvers && (
      <>
        <Typography variant="button" display="block" style={{ color: "rgb(120, 138, 156)" }}>
          <Text message="common.approvers" />
        </Typography>
        <FBMapWrapper<Employee> collection={approvers}>
          {(approver, index) => (
            <Box key={`fb-approver-${index}`} display="flex" alignItems="center" letterSpacing={0.8}>
              <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightBold">
                {approver.user?.name}
                <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                  | {approverStatus && approverStatus(approver.user?.email)}
                </Box>
              </Box>
              {canApprove && canApprove(approver.user?.email) && (
                <FBButton
                  {...props}
                  {...{ disabled }}
                  onClick={onClick && onClick("approver")}
                />
              )}
            </Box>
          )}
        </FBMapWrapper>
      </>
    )}
    {approverGroups && (
      <Box mt={approvers ? 2 : 0}>
        <Typography variant="button" display="block" style={{ color: "rgb(120, 138, 156)" }}>
          <Text message="form.builder.approver.groups" />
        </Typography>
        <FBMapWrapper<GroupRequestBody> collection={approverGroups}>
          {(group, index) => (
            <Box key={`fb-approver-group-${index}`} display="flex" alignItems="center" letterSpacing={0.8}>
              <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightBold">
                {group.name}
                <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                | {approverStatus && approverStatus(group.id)}
                </Box>
              </Box>
              {canApprove && canApprove(group.id) && (
                <FBButton
                  {...props}
                  {...{ disabled }}
                  onClick={onClick && onClick("group")}
                />
              )}
            </Box>
          )}
        </FBMapWrapper>
      </Box>
    )}
    {!approvers && !approverGroups && <FBButton {...props} {...{ disabled }} />}
  </Box>
);

export default withFBApprovalField(FBApprovalField);
