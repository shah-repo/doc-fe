import { Avatar, Box, Collapse } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInlineApprovalBody, FBInput, FBMapWrapper, FBProvider, FBRequiredApprover, FBText, Owner } from '..';
import { MomentFormats, useDate } from '../../../common/utils/date';
import { ApprovalStatus } from '../../../state/ducks/common/types';
import { DocumentStatus } from '../../../state/ducks/documents/types';
import { getInitalsFromName } from '../../components/icons/avatar/helpers';
import { isDocumentRevisionApproved } from '../../documentRevision/helpers/documentRevisionStatus';
import { StyledCancelFBButton } from '../FBButton/StyledCancelFBButton';
import ApprovalApprovedGroup from './ApprovalApprovedGroup';
import useStyles from './FBBuildTypeChangeApproval.styles';
import { FBBuildTypeChangeApprovalProps } from './FBBuildTypeChangeApproval.types';
import { withFBBuildTypeChangeApproval } from './FBBuildTypeChangeApproval.wrap';
import { APPROVAL_STATUS_LABEL } from './utils';

const FBBuildTypeChangeApproval: React.FunctionComponent<FBBuildTypeChangeApprovalProps> = ({
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
  disabledOptions,
  disableChipDelete,
  owners,
  showFieldOwnersWarning,
  isContributorIncluded,
  autosave,
  approvalApprovedGroup,
  selectedValue,
  prevValue,
  ...props
}) => {
  const classes = useStyles();
  const { getFormattedDateString } = useDate();
  const [pendingOpen, setPendingOpen] = React.useState(true);
  const [approvedOpen, setApprovedOpen] = React.useState(true);

  const pendingApprovals = approvals.filter((a) => !isDocumentRevisionApproved(a.status) && a.status !== ApprovalStatus.Rejected);
  const approvedApprovals = approvals.filter((a) => isDocumentRevisionApproved(a.status));

  const renderApprovalRow = (approval: FBInlineApprovalBody, index: number) => {
    const isApproved = isDocumentRevisionApproved(approval.status);
    const approverName = isApproved ? approval.approverName : approval.approver?.user.name;
    const approverEmail = isApproved ? approval.approverEmail : approval.approver?.user.email;
    const statusLabel = APPROVAL_STATUS_LABEL[approval.status || ''] ?? approval.status ?? '';

    return (
      <React.Fragment key={`fb-ia-info-${approval.id}-${index}`}>
        {index > 0 && <Box className={classes.approvalDivider} />}
        <Box
          data-cy={isApproved ? 'approved-' + approval.approverName : 'not-approved-' + approval.approver?.user.name}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={2}
        >
          <Box className={classes.approvalInfoContainer}>
            <Avatar
              src={approval.approver?.user.avatar || undefined}
              alt={approverName || ''}
              className={classes.avatar}
              style={{ '--avatar-bg-color': approval.approver?.user.initialColor } as React.CSSProperties}
            >
              {!approval.approver?.user.avatar && approverName && getInitalsFromName(approverName)}
            </Avatar>
            <Box>
              <Box className={classes.approverName}>{approverName}</Box>
              <Box className={classes.approverEmail}>{approverEmail}</Box>
              {approval.canRequest && inlineApprovalExists && !isAlphaReleased && (
                <FBButton
                  className={classes.requestApprovalButton}
                  label="form.builder.request.approval"
                  variant="text"
                  color="primary"
                  onClick={() => requestApproval?.(approval.id)}
                />
              )}
            </Box>
          </Box>

          <Box className={classes.actionsContainer}>
            {documentStatus === DocumentStatus.InReview
              && approval.status === ApprovalStatus.Pending
              && currentUser === approval.approver?.user.id
              ? (
                <Box className={classes.buttonGroup}>
                  <StyledCancelFBButton
                    {...{ disabled }}
                    label="common.reject"
                    size="small"
                    className={classes.actionButton}
                    onClick={() => approvalTransition?.('reject', approval.id)}
                  />
                  <FBButton
                    {...{ disabled }}
                    label="form.builder.request.approve"
                    size="small"
                    className={classes.actionButton}
                    onClick={() => onApproveClick?.(approval.id || '')}
                  />
                </Box>
              ) : isApproved ? (
                <Box>
                  <Box className={classes.approvedStatus}>
                    <CheckCircleIcon className={classes.approvedIcon} />
                    <span>{statusLabel}</span>
                  </Box>
                  {approval.reviewedAt && (
                    <Box className={classes.approvedDate}>
                      {getFormattedDateString(approval.reviewedAt, MomentFormats.DateTime)}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box className={classes.statusText}>{statusLabel}</Box>
              )
            }
          </Box>
        </Box>
      </React.Fragment>
    );
  };

  return (
    <FBProvider {...{ dialogState }}>
      <FBDialog />
      <FBInput {...props} {...{ name, autosave }} type="approvals">
        <FBText
          locale={label as string}
          boxProps={{
            className: classes.label,
          }}
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
          {...{ disabled, renderOption, loading, disabledOptions, disableChipDelete }}
          autoCompleteClasses={{ root: classes.deleteChip }}
        />
        <Box className={classes.approvalApprovedGroupContainer}>
          {approvalApprovedGroup ? (
            approvalApprovedGroup.map((groupName: string, index: number) => (
              <ApprovalApprovedGroup groupName={groupName} key={index} isChecked />
            ))
          ) : (
            <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
              {(group: FBRequiredApprover, id) => (
                <ApprovalApprovedGroup groupName={group.name} key={id} isChecked={isIncluded?.(group)} />
              )}
            </FBMapWrapper>
          )}
        </Box>
        {showFieldOwnersWarning && owners && (
          <Box className={classes.ownersWarningContainer}>
            <FBMapWrapper<Owner[]> collection={owners}>
              {(owner: Owner, id) => (
                <Box className={classes.ownerItemContainer} key={`fb-approvals-${id}`}>
                  <CheckCircleIcon
                    data-cy={`fb-approvals-${owner.name}-check-${isContributorIncluded?.(owner.id) ? 'marked' : 'disabled'}`}
                    color={isContributorIncluded?.(owner.id) ? 'primary' : 'disabled'}
                  />
                  <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={owner.name} />
                </Box>
              )}
            </FBMapWrapper>
          </Box>
        )}

        {pendingApprovals.length > 0 && (
          <Box className={classes.sectionContainer} mb={2}>
            <Box className={classes.sectionHeader} onClick={() => setPendingOpen(!pendingOpen)}>
              <Box display="flex" alignItems="center">
                {pendingOpen
                  ? <ExpandLessIcon className={classes.sectionChevron} />
                  : <ExpandMoreIcon className={classes.sectionChevron} />
                }
                <Box className={classes.sectionTitle}>Pending</Box>
              </Box>
              <Box className={classes.sectionCount}>
                {pendingApprovals.length} {pendingApprovals.length === 1 ? 'item' : 'items'}
              </Box>
            </Box>
            <Collapse in={pendingOpen}>
              {pendingApprovals.map((approval, index) => renderApprovalRow(approval, index))}
            </Collapse>
          </Box>
        )}

        {approvedApprovals.length > 0 && (
          <Box className={classes.sectionContainer} mb={2}>
            <Box className={classes.sectionHeader} onClick={() => setApprovedOpen(!approvedOpen)}>
              <Box display="flex" alignItems="center">
                {approvedOpen
                  ? <ExpandLessIcon className={classes.sectionChevron} />
                  : <ExpandMoreIcon className={classes.sectionChevron} />
                }
                <Box className={classes.sectionTitle}>Approved</Box>
              </Box>
              <Box className={classes.sectionCount}>
                {approvedApprovals.length} {approvedApprovals.length === 1 ? 'item' : 'items'}
              </Box>
            </Box>
            <Collapse in={approvedOpen}>
              {approvedApprovals.map((approval, index) => renderApprovalRow(approval, index))}
            </Collapse>
          </Box>
        )}
      </FBInput>
    </FBProvider>
  );
};

export default withFBBuildTypeChangeApproval(FBBuildTypeChangeApproval);
