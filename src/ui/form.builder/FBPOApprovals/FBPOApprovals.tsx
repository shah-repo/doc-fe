import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInlineApprovalBody, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBProvider, FBRequiredApprover, FBSection, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { ApprovalStatus } from "../../../state/ducks/common/types";
import { DocumentStatus } from "../../../state/ducks/documents/types";
import Colors from "../../layout/theme/utils/colors";
import { FBPOApprovalsProps } from "./FBPOApprovals.types";
import { withFBPOApprovals } from "./FBPOApprovals.wrap";

const FBPOApprovals: React.FunctionComponent<FBPOApprovalsProps> = ({
  renderOption,
  isIncluded,
  approvalTransition,
  onApproveClick,
  name,
  disabled,
  loading,
  groups = {},
  autosave,
  label,
  approvals,
  currentUser,
  documentStatus,
  dialogState,
  ...props
}) => (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    <FBInput {...props} {...{ name, autosave }} type="poapprovals">
      <Box>
        <FBSection
          name={`fb-po-approvals-section-${name}`}
          {...{ label }}
        />
        <FBAutocompleteAsync
          label="form.builder.approvers"
          name={`${name}`}
          optionId={FBAutocompleteAsyncOption.availableApprovers}
          withState
          gutter={false}
          multiple={true}
          omitFormValue={true}
          {...{ disabled, renderOption, loading, autosave }}
        />
        <Box display="flex" flexWrap="wrap" my={2}>
          <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
            {(group: FBRequiredApprover, id) => (
              <Box display="flex" key={`fb-po-approvals-group-${id}`} mr={2.5}>
                <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
                <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
              </Box>
            )}
          </FBMapWrapper>
        </Box>
        <FBMapWrapper<FBInlineApprovalBody[]> collection={approvals as FBInlineApprovalBody[]}>
          {(approval: FBInlineApprovalBody, index) => (
            <Box
              key={`fb-po-approvals-info-${approval.id}-${index}`}
              pb={currentUser === approval.approver?.user.id ? 0 : 0.6}
              display="flex"
              flexDirection="row"
              alignItems="center"
              mb={4}
            >
              {approval.approver?.user.name}
              {approval.status && approval.status !== "DRAFT" && (
                <Box color={Colors.gray}>&nbsp;| {FBInlineApprovalStatusIdent[approval.status]}</Box>
              )}
              {approval.reviewedAt && approval.status !== "DRAFT" && (
                <Box color={Colors.gray}>
              &nbsp;| {getFormattedDateString(approval.reviewedAt, MomentFormats.DateTime)}
                </Box>
              )}
              {documentStatus === DocumentStatus.InReview
              && approval.status === ApprovalStatus.Pending
              && currentUser === approval.approver?.user.id
              && (
                <Box flexGrow={1} textAlign="right">
                  <FBButton
                    label="common.reject"
                    size="small"
                    style={{ fontSize: "11px" }}
                    onClick={() => approvalTransition("reject", approval.id)}
                  />
                  <FBButton
                    label="form.builder.request.approve"
                    size="small"
                    style={{ fontSize: "11px" }}
                    onClick={() => onApproveClick?.(approval.id || "")}
                  />
                </Box>
              )}
            </Box>
          )}
        </FBMapWrapper>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBPOApprovals(FBPOApprovals);
