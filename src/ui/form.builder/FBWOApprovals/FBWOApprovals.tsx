import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import {
  FBAutocompleteAsync,
  FBAutocompleteAsyncOption,
  FBButton,
  FBDialog,
  FBInlineApprovalBody,
  FBInlineApprovalStatusIdent,
  FBInput,
  FBMapWrapper,
  FBProvider, FBSection,
} from '..';
import { ReactComponent as EmailSuccessIcon } from '../../../assets/images/email_success.svg';
import {
  getFormattedDateString,
  MomentFormats,
} from '../../../common/utils/date';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import Text from '../../../ui/components/Text';
import { getInitalsFromName } from '../../components/icons/avatar/helpers';
import CompletedBlock from '../FBWOApprovals/CompletedBlock';
import useStyles from './FBWOApprovals.styles';
import { FBWOApprovalsProps } from './FBWOApprovals.types';
import { withFBWOApprovals } from './FBWOApprovals.wrap';

const FBWOApprovals: React.FunctionComponent<FBWOApprovalsProps> = ({
  onApproveClick,
  dialogState,
  approvals = [],
  currentUser,
  disabled,
  documentStatus,
  label,
  name,
  renderOption,
  loading,
  disabledOptions,
  disableChipDelete,
  owners,
  autosave,
  ...props
}) => {
  const classes = useStyles();
  const pendingStates = [
    FBInlineApprovalStatusIdent.DRAFT,
    FBInlineApprovalStatusIdent.PENDING,
  ];
  const intl = useIntl();

  const approvalsByStatus = approvals?.reduce<
  Record<string, FBInlineApprovalBody[]>
  >((list, approval) => {
    if (!approval.status) {
      return list;
    }
    if (!list[approval.status]) {
      list[approval.status] = [];
    }
    list[approval.status].push(approval);
    return list;
  }, {});

  const isApproved = (status) => {
    return status === FBInlineApprovalStatusIdent.APPROVED;
  };

  return (
    <FBProvider {...{ dialogState }}>
      <FBDialog />
      <FBInput {...props} {...{ name, autosave }} type="approvals">
        <FBSection name={`fb-approvals-section-${name}`} {...{ label }} />
        {documentStatus !== DocumentRevisionStatus.Approved && (
          <FBAutocompleteAsync
            placeholder="form.builder.start.typing.list"
            label="form.builder.wo.users"
            name={`fb-approvals-${name}`}
            optionId={FBAutocompleteAsyncOption.availableApprovers}
            withState
            gutter={false}
            multiple={true}
            autosave={false}
            {...{
              disabled,
              renderOption,
              loading,
              disabledOptions,
              disableChipDelete,
            }}
          />
        )}

        <Box>
          <FBMapWrapper<Record<string, FBInlineApprovalBody[]>>
            collection={approvalsByStatus}
          >
            {(approvals, status) => {
              const poStatusText = pendingStates.includes(status)
                ? 'common.pending.approval'
                : 'common.completed';

              const poStatusHeaderText = pendingStates.includes(status)
                ? 'common.pending'
                : 'common.completed';

              const poStatusHeaderTextMessage = intl.formatMessage({
                id: poStatusHeaderText,
              });
              return (
                <CompletedBlock
                  headerText={poStatusHeaderText}
                  itemsCount={approvals.length}
                  key={status}
                >
                  <List className={classes.approvalsList}>
                    <FBMapWrapper<FBInlineApprovalBody[]>
                      collection={approvals}
                    >
                      {(approval, index: number) => {
                        const isUserNeedToApprove
                          = documentStatus === DocumentRevisionStatus.InReview
                          && approval.approver?.user.id === currentUser
                          && approval.status
                            === FBInlineApprovalStatusIdent.PENDING;

                        return (
                          <ListItem
                            divider={index < approvals.length - 1}
                            key={approval.id}
                            className={classes.listItem}
                          >
                            <ListItemAvatar>
                              <Avatar
                                className={classes.avatar}
                                src={approval.approver.user.avatar}
                                style={{
                                  backgroundColor:
                                    approval.approver.user.initialColor,
                                }}
                                alt={approval.approver.user.name}
                              >
                                {!approval.approver.user.avatar
                                  && getInitalsFromName(
                                    approval.approver.user.name,
                                  )}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="h6"
                                  component="h6"
                                  data-cy={`user-name-${index}-${approval.status}`}
                                  className={classes.nameText}
                                >
                                  {approval.approver.user.name}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  data-cy={`user-email-${index}-${approval.status}`}
                                  className={classes.emailText}
                                >
                                  {approval.approver.user.email}
                                </Typography>
                              }
                            />
                            <ListItemText
                              className={classes.stateInfo}
                              primary={
                                isUserNeedToApprove ? (
                                  <Box flexGrow={1} textAlign="right">
                                    <FBButton
                                      label="form.builder.wo.complete"
                                      size="small"
                                      className={classes.completeButton}
                                      onClick={() =>
                                        onApproveClick?.(approval.id || '')
                                      }
                                    />
                                  </Box>
                                ) : (
                                  <Typography
                                    variant="caption"
                                    data-cy={`user-${index}-${poStatusHeaderTextMessage}-status-text`}
                                    className={classes.stateText}
                                  >
                                    {isApproved(approval.status) && (
                                      <EmailSuccessIcon
                                        className={classes.successIcon}
                                      />
                                    )}
                                    <Text message={poStatusText} />
                                  </Typography>
                                )
                              }
                              secondary={
                                isApproved(status) && (
                                  <Typography
                                    variant="caption"
                                    className={classes.dateText}
                                    data-cy={`date-timestamp-${index}-${approval.status}`}
                                  >
                                    {getFormattedDateString(
                                      approval.reviewedAt,
                                      MomentFormats.DateTime,
                                    )}
                                  </Typography>
                                )
                              }
                            />
                          </ListItem>
                        );
                      }}
                    </FBMapWrapper>
                  </List>
                </CompletedBlock>
              );
            }}
          </FBMapWrapper>
        </Box>
      </FBInput>
    </FBProvider>
  );
};

export default withFBWOApprovals(FBWOApprovals);
