import { Box, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
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
  approverStatusInfo,
  approverGroups,
  onClick,
  disabled,
  isBlocked,
  approveIsBlocking,
  approverIsVisible,
  hasApproved,
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
            <Box key={`fb-approver-${index}`} display="flex" alignItems="center">
              {approverIsVisible && approverIsVisible(approver.user?.email) && (
                <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightBold">
                  {approver.user?.name}
                  <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                    {approverStatusInfo && approverStatusInfo(approver.user?.email)}
                  </Box>
                </Box>
              )}
              {canApprove && canApprove(approver.user?.email) && (
                <FBButton
                  style={{ marginTop: "-5px", marginBottom: "-5px" }}
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
        <FBMapWrapper<GroupRequestBody> collection={approverGroups}>
          {(group, index) => (
            <Box key={`fb-approver-group-${index}`} display="flex" alignItems="center">
              {approverIsVisible && approverIsVisible(group.id) && (
                <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightBold">
                  {group.name}
                  <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                    {approverStatusInfo && approverStatusInfo(group.id)}
                  </Box>
                </Box>
              )}
              {canApprove && canApprove(group.id) && (
                <FBButton
                  style={{ marginTop: "-5px", marginBottom: "-5px" }}
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
    {approveIsBlocking && (
      <Box
        mt={4}
        justifyContent="center"
        alignItems="center"
        component="span"
        display="flex"
        p={1.5}
        borderRadius={3}
        bgcolor={isBlocked ? "error.main" : "green"}
        color="white"
      >
        {isBlocked && <WarningIcon />}
        {!isBlocked && <CheckCircleIcon />}
        <Box ml={1}>
          {isBlocked && <Text message="form.builder.approval.waiting" />}
          {!isBlocked && <Text message="form.builder.approved" />}
        </Box>
      </Box>
    )}
  </Box>
);

export default withFBApprovalField(FBApprovalField);
