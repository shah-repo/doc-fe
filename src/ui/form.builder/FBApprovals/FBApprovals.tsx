import { Box, Button, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBMapWrapper, FBProvider, FBRequiredApprover, FBSection, FBText } from "..";
import { Approval, ApprovalStatus } from "../../../state/ducks/common";
import { DocumentStatus } from "../../../state/ducks/documents";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { FBApprovalsProps, FBApprovalsStatusEndpoint } from "./FBApprovals.types";
import { withFBApprovals } from "./FBApprovals.wrap";

const FBApprovals: React.FunctionComponent<FBApprovalsProps> = ({
  approvals = [],
  approvalsState,
  changeApprovalStatus,
  currentEmployeeId,
  disabled,
  docId,
  documentStatus,
  formState,
  groups = {},
  isIncluded,
  label,
  name,
  ownerId,
  renderOption,
}) => (
  <FBProvider {...{ approvalsState, formState }}>
    {(documentStatus === DocumentStatus.Draft || documentStatus === DocumentStatus.InReview) && (
      <>
        <FBSection {...{ label }} />
        <FBAutocompleteAsync
          label="form.builder.approvals"
          optionId={FBAutocompleteAsyncOption.availableApprovers}
          optionValueType="id"
          withState={true}
          {...{ renderOption, disabled, name }}
        />
        {docId && (
          <>
            <Typography variant="h6">
              <Text translation="record.required.approvals" />
            </Typography>
            <Box display="flex" flexWrap="wrap">
              <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
                {(group: FBRequiredApprover, id) => (
                  <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5} >
                    <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
                    <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
                  </Box>
                )}
              </FBMapWrapper>
            </Box>
          </>
        )}
      </>
    )}
    {docId && approvals.length > 0 && (
      <Box>
        <Typography variant="h6">
          <Text translation="common.approvers" />
        </Typography>
        <FBMapWrapper collection={approvals}>
          {(approval: Approval) => (
            <>
              <Box p={2} mt={-2}>
                <Box>
                  <Typography id="userName" variant="h5" component="span">{approval.approver.user.name}</Typography>
                  <Typography id="statusdate" variant="h5" component="span">
                    {` | ${approval.status}`}
                    {approval.reviewedAt && (
                      <span>
                        {"| "}
                        <DateTime value={approval.reviewedAt} />
                      </span>
                    )}
                  </Typography>
                  {ownerId === currentEmployeeId
                  && (approval.status === ApprovalStatus.Pending || approval.status === ApprovalStatus.Draft)
                  && (
                    <Typography
                      variant="h6"
                      onClick={() => changeApprovalStatus(FBApprovalsStatusEndpoint.ABANDON, approval.id)}
                    >
                      <Text translation="record.remove.approval" />
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                {documentStatus === DocumentStatus.InReview
                  && approval.status === ApprovalStatus.Pending
                  && approval.approver.id === currentEmployeeId
                  && changeApprovalStatus && (
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      onClick={() => changeApprovalStatus(FBApprovalsStatusEndpoint.APPROVE, approval.id)}
                    >
                      <Text translation="common.approve" />
                    </Button>
                    <Button onClick={() => changeApprovalStatus(FBApprovalsStatusEndpoint.REJECT, approval.id)}>
                      <Text translation="common.reject" />
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </FBMapWrapper>
      </Box>
    )}
  </FBProvider>
);

export default withFBApprovals(FBApprovals);
