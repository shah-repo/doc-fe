import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBInlineApprovalBody, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBRequiredApprover, FBSection, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { ApprovalStatus } from "../../../state/ducks/common";
import { DocumentStatus } from "../../../state/ducks/documents";
import Colors from "../../layout/theme/utils/colors";
import { FBApprovalsProps } from "./FBApprovals.types";
import { withFBApprovals } from "./FBApprovals.wrap";

const FBApprovals: React.FunctionComponent<FBApprovalsProps> = ({
  requestApproval,
  approvals = [],
  changeApprovalStatus,
  currentUser,
  disabled,
  docId,
  documentStatus,
  groups = {},
  isIncluded,
  label,
  name,
  ownerId,
  renderOption,
  loading,
  inlineApprovalExists,
  ...props
}) => (
  <FBInput {...props} {...{ name }} type="approvals">
    <FBSection {...{ label }} />
    <FBAutocompleteAsync
      label="form.builder.approvals"
      name={`fb-approvals-${name}`}
      optionId={FBAutocompleteAsyncOption.availableApprovers}
      withState
      gutter={false}
      multiple={true}
      {...{ disabled, renderOption, loading }}
    />
    <Box display="flex" flexWrap="wrap" my={2}>
      <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
        {(group: FBRequiredApprover, id) => (
          <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5}>
            <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
            <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
          </Box>
        )}
      </FBMapWrapper>
    </Box>
    <FBMapWrapper<FBInlineApprovalBody[]> collection={approvals}>
      {(approval: FBInlineApprovalBody, index) => (
        <Box
          key={`fb-ia-info-${approval.id}-${index}`}
          pb={currentUser === approval.approver?.user.id ? 0 : 0.6}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          {approval.approver?.user.name}
          {approval.status && approval.status !== "DRAFT" && (
            <Box color={Colors.gray}>&nbsp;| {FBInlineApprovalStatusIdent[approval.status]}</Box>
          )}
          {approval.reviewedAt && (
            <Box color={Colors.gray}>
              &nbsp;| {getFormattedDateString(approval.reviewedAt, MomentFormats.DateTime12h)}
            </Box>
          )}
          {approval.canRequest && inlineApprovalExists && (
            <>
              <Box> |</Box>
              <FBButton
                style={{ margin: 0 }}
                label="form.builder.request.approval"
                variant="text"
                color="primary"
                onClick={() => requestApproval?.(approval.id)}
              />
            </>
          )}
          {documentStatus === DocumentStatus.InReview
          && approval.status === ApprovalStatus.Pending
          && currentUser === approval.approver?.user.id
          && (
            <Box flexGrow={1} textAlign="right">
              <FBButton
                {...{ disabled }}
                label="common.reject"
                size="small"
                style={{ fontSize: "11px" }}
                onClick={() => changeApprovalStatus("reject", approval.id)}
              />
              <FBButton
                {...{ disabled }}
                label="form.builder.request.approve"
                size="small"
                style={{ fontSize: "11px" }}
                onClick={() => changeApprovalStatus("approve", approval.id)}
              />
            </Box>
          )}
        </Box>
      )}
    </FBMapWrapper>
  </FBInput>
);

export default withFBApprovals(FBApprovals);
