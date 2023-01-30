import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import cx from "classnames";
import { orderBy } from "lodash";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInlineApprovalBody, FBInput, FBMapWrapper, FBProvider, FBRequiredApprover, FBSection, FBText } from "..";
import { ReactComponent as EmailSuccessIcon } from "../../../assets/images/email_success.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { ApprovalStatus } from "../../../state/ducks/documents/types";
import Text from "../../../ui/components/Text";
import { getInitalsFromName } from "../../components/icons/avatar/helpers";
import Colors from "../../layout/theme/utils/colors";
import ApprovalsBlock from "./ApprovalsBlock";
import useStyles from "./FBPOApprovals.styles";
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
}) => {
  const classes = useStyles();

  const approvalsByStatus = approvals?.reduce((list, approval) => {
    if (approval.status) {
      if (!list[approval.status]) {
        list[approval.status] = [];
      }
      list[approval.status].push(approval);
    }
    return list;
  }, {} as Record<string, FBInlineApprovalBody[]>);

  const pendingStates = ["DRAFT", "PENDING"];

  return  (
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
            {...{ disabled, renderOption, loading, disabledOptions, disableChipDelete }}
          />
          <Box display="flex" flexWrap="wrap" my={2}>
            <FBMapWrapper<FBRequiredApprover[]> collection={orderBy(groups, "documentStage")}>
              {(group: FBRequiredApprover) => (
                <Box display="flex" key={`fb-po-approvals-group-${group.id}`} mr={2.5}>
                  <CheckCircleIcon style = {{ color: isIncluded?.(group) ? Colors.green_blue : "disabled" }} />
                  <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
                </Box>
              )}
            </FBMapWrapper>
          </Box>
          <Box>
            <FBMapWrapper<Record<string, FBInlineApprovalBody[]>>
              collection={approvalsByStatus as Record<string, FBInlineApprovalBody[]>}
            >
              {(approvals, status) => {

                const poStatusText = pendingStates.includes(status)
                  ? "common.pending.approval"
                  : "APPROVED";

                const poStatusHeaderText = pendingStates.includes(status)
                  ? "common.pending"
                  : "APPROVED";

                return (
                  <ApprovalsBlock
                    headerText={poStatusHeaderText}
                    itemsCount={approvals.length}
                    key={status}
                  >
                    <List className={classes.approvalsList}>
                      <FBMapWrapper<FBInlineApprovalBody[]>
                        collection={approvals}
                      >
                        {(approval, index: number) => {
                          const isUserNeedToApprove =
                          documentStatus === DocumentRevisionStatus.InReview
                          && approval.approver?.user.id === currentUser
                          && approval.status === ApprovalStatus.Pending;

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
                                  style={{ backgroundColor: approval.approver.user.initialColor }}
                                  alt={approval.approver.user.name}
                                >
                                  {!approval.approver.user.avatar && getInitalsFromName(approval.approver.user.name)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="h6"
                                    component="h6"
                                    className={classes.nameText}
                                  >
                                    {approval.approver.user.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    className={classes.emailText}
                                  >
                                    {approval.approver.user.email}
                                  </Typography>
                                }
                              />
                              <ListItemText
                                className={classes.stateInfo}
                                primary={
                                  isUserNeedToApprove
                                    ? (
                                      <Box flexGrow={1} textAlign="right">
                                        {/*
                                          TODO
                                          Review as outlined afer fixing FBButton or use other generic button component
                                        */}
                                        <FBButton
                                          label="common.reject"
                                          size="small"
                                          className={cx(classes.poButton, classes.poRejectButton)}
                                          onClick={() => approvalTransition("reject", approval.id)}
                                        />
                                        <FBButton
                                          label="form.builder.request.approve"
                                          size="small"
                                          className={classes.poButton}
                                          onClick={() => onApproveClick?.(approval.id || "")}
                                        />
                                      </Box>
                                    )
                                    : (
                                      <Typography
                                        variant="caption"
                                        className={classes.stateText}
                                      >
                                        {approval.status === ApprovalStatus.Approved && (
                                          <EmailSuccessIcon className={classes.successIcon} />
                                        )}
                                        <Text message={poStatusText} />
                                      </Typography>
                                    )
                                }
                                secondary={
                                  (status === ApprovalStatus.Approved) && (
                                    <Typography
                                      variant="caption"
                                      className={classes.dateText}
                                    >
                                      {getFormattedDateString(approval.reviewedAt, MomentFormats.DateTime)}
                                    </Typography>
                                  )
                                }
                              />
                            </ListItem>
                          );
                        }}
                      </FBMapWrapper>
                    </List>
                  </ApprovalsBlock>
                );
              }}
            </FBMapWrapper>
          </Box>
        </Box>
      </FBInput>
    </FBProvider>
  );
};

export default withFBPOApprovals(FBPOApprovals);
