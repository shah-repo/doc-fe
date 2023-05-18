import { Box } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React from 'react';
import { FBApprovalsProps, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInlineApprovalBody, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBProvider, FBRequiredApprover, FBSection, FBText, Owner } from '..';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { ApprovalStatus } from '../../../state/ducks/common/types';
import { DocumentStatus } from '../../../state/ducks/documents/types';
import { isDocumentRevisionApproved } from '../../documentRevision/helpers/documentRevisionStatus';
import { StyledCancelFBButton } from '../FBButton/StyledCancelFBButton';
import { withFBApprovals } from './FBApprovals.wrap';

const FBApprovals: React.FunctionComponent<FBApprovalsProps> = ({
  onApproveClick,
  dialogState,
  requestApproval,
  approvals = [],
  approvalTransition,
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
  isAlphaReleased,
  owners,
  showFieldOwnersWarning,
  isContributorIncluded,
  autosave,
  ...props
}) => (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    <FBInput {...props} {...{ name, autosave }} type="approvals">
      <FBSection
        name={`fb-approvals-section-${name}`}
        {...{ label }}
      />
      <FBAutocompleteAsync
        placeholder="form.builder.start.typing.list"
        label="form.builder.approvers"
        name={`fb-approvals-${name}`}
        optionId={FBAutocompleteAsyncOption.availableApprovers}
        withState
        gutter={false}
        multiple={true}
        autosave={false}
        {...{ disabled, renderOption, loading }}
      />
      <Box display="flex" flexWrap="wrap" my={2}>
        <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
          {(group: FBRequiredApprover, id) => (
            <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5}>
              <CheckCircleIcon color={isIncluded?.(group) ? 'primary' : 'disabled'} />
              <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
            </Box>
          )}
        </FBMapWrapper>
      </Box>
      {showFieldOwnersWarning && owners && <Box display="flex" flexWrap="wrap" mb={4}>
        <FBMapWrapper<Owner[]> collection={owners}>
          {(owner: Owner, id) => (
            <Box display="flex" key={`fb-approvals-${id}`} mr={2.5} >
              <CheckCircleIcon
                data-cy={
                  `fb-approvals-${owner.name}-check-${isContributorIncluded?.(owner.id) ? 'marked' : 'disabled'}`
                }
                color={isContributorIncluded?.(owner.id) ? 'primary' : 'disabled'}
              />
              <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={owner.name} />
            </Box>
          )}
        </FBMapWrapper>
      </Box>}
      <FBMapWrapper<FBInlineApprovalBody[]> collection={approvals}>
        {(approval: FBInlineApprovalBody, index) => {
          const isApproved = isDocumentRevisionApproved(approval.status);
          return (
            <Box
              data-cy={isApproved ? 'approved-' + approval.approverName :
                'not-approved-' + approval.approver?.user.name}>
              <Box
                key={`fb-ia-info-${approval.id}-${index}`}
                pb={currentUser === approval.approver?.user.id ? 0 : 0.6}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                {<Box fontWeight="bold">{
                  isApproved ? approval.approverName :  approval.approver?.user.name
                }</Box>}
                {approval.status && approval.approverGroup && (
                  <Box>&nbsp;| {approval.approverGroup?.join(', ')}</Box>
                )}
                {approval.status && (
                  <Box>&nbsp;| {FBInlineApprovalStatusIdent[approval.status]}</Box>
                )}
                {approval.reviewedAt && isApproved && (
                  <Box>&nbsp;| {getFormattedDateString(approval.reviewedAt, MomentFormats.DateTime)}</Box>
                )}
                {approval.canRequest && inlineApprovalExists && !isAlphaReleased && (
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
                    <StyledCancelFBButton
                      {...{ disabled }}
                      label="common.reject"
                      size="small"
                      style={{ fontSize: '11px' }}
                      onClick={() => approvalTransition('reject', approval.id)}
                    />
                    <FBButton
                      {...{ disabled }}
                      label="form.builder.request.approve"
                      size="small"
                      style={{ fontSize: '11px' }}
                      onClick={() => onApproveClick?.(approval.id || '')}
                    />
                  </Box>
                )}
              </Box>
              <Box mt={1} mb={4}>
                { isApproved ? approval.approverEmail : approval.approver?.user.email }
              </Box>
            </Box>
          ); }
        }
      </FBMapWrapper>
    </FBInput>
  </FBProvider>
);

export default withFBApprovals(FBApprovals);
