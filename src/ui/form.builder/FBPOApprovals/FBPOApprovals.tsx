import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { orderBy } from "lodash";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInlineApprovalBody, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBProvider, FBRequiredApprover, FBSection, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { ApprovalStatus } from "../../../state/ducks/common/types";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { isDocumentRevisionApproved } from "../../documentRevision/helpers/documentRevisionStatus";
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
  disabledOptions,
  disableChipDelete,
  ...props
}) => (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    <FBInput {...props} {...{ name }} type="poapprovals">
      <Box>
        <FBSection
          name={`fb-po-approvals-section-${name}`}
          {...{ label }}
        />
        <FBAutocompleteAsync
          name={name}
          label="form.builder.approvers"
          optionId={FBAutocompleteAsyncOption.availableApprovers}
          gutter={false}
          multiple
          withState
          omitFormValue
          filterSelectedOptions
          disableClearable
          disableBackspace
          disableChipDelete
          {...{ disabled, renderOption, loading, disabledOptions }}
        />
        <Box display="flex" flexWrap="wrap" my={2}>
          <FBMapWrapper<FBRequiredApprover[]> collection={orderBy(groups, "documentStage")}>
            {(group: FBRequiredApprover) => (
              <Box display="flex" key={`fb-po-approvals-group-${group.id}`} mr={2.5}>
                <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
                <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
              </Box>
            )}
          </FBMapWrapper>
        </Box>
        <FBMapWrapper<FBInlineApprovalBody[]> collection={approvals as FBInlineApprovalBody[]}>
          {(approval: FBInlineApprovalBody, index) => {
            const isApproved = isDocumentRevisionApproved(approval.status);
            return (
              <Box mb={4} key={index}>
                <Box
                  key={`fb-po-approvals-info-${approval.id}-${index}`}
                  pb={currentUser === approval.approver?.user.id ? 0 : 0.6}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Box fontWeight="bold">
                    { isApproved ? approval.approverName :  approval.approver?.user.name }
                  </Box>
                  {approval.status && approval.approverGroup && isApproved && (
                    <Box>&nbsp;| {approval.approverGroup?.join(", ")}</Box>
                  )}
                  {approval.status && <Box>&nbsp;| {FBInlineApprovalStatusIdent[approval.status]}</Box>}
                  {approval.reviewedAt && isApproved && (
                    <Box>&nbsp;| {getFormattedDateString(approval.reviewedAt, MomentFormats.DateTime)}</Box>
                  )}
                  {documentStatus === DocumentRevisionStatus.InReview
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
                <Box mt={1}>
                  { isApproved ? approval.approverEmail : approval.approver?.user.email }
                </Box>
              </Box>
            ); }
          }
        </FBMapWrapper>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBPOApprovals(FBPOApprovals);
