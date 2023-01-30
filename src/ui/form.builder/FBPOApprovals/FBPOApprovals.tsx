import { Avatar, Box, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
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
import { styles } from "./FBPOApprovals.styles";
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
  const classes = styles();
  const approvalsByStatus = approvals?.reduce((list, approval) => {
    if (approval.status) {
      if (!list[approval.status]) {
        list[approval.status] = [];
      }
      list[approval.status].push(approval);
    }
    return list;
  }, {} as Record<string, FBInlineApprovalBody[]>);

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
              {(approvals, status, statusIndex) => {

                const poStatusText = ["DRAFT", "PENDING"].includes(status)
                  ? "common.pending.approval"
                  : "APPROVED";

                return (
                  <ApprovalsBlock {...{ status, approvals, classes }} key={status + statusIndex}>
                    <FBMapWrapper<FBInlineApprovalBody[]>
                      collection={approvals}
                    >
                      {(approval, index: number) => {

                        const isCurrentUserIsApprover = () =>
                          documentStatus === DocumentRevisionStatus.InReview
                          && approval.status === ApprovalStatus.Pending
                          && currentUser === approval.approver?.user.id;

                        const isCurrentUserIsNotApprover = () =>
                          documentStatus === DocumentRevisionStatus.InReview
                          && approval.status === ApprovalStatus.Pending
                          && currentUser !== approval.approver?.user.id;

                        return (
                          <>
                            <List>
                              <ListItem key={approval.id} className={classes.listItem}>
                                <ListItemAvatar>
                                  {approval.approver.user.avatar ? (
                                    <Avatar
                                      className={classes.avatar}
                                      src={approval.approver.user.avatar}
                                      alt={approval.approver.user.name}
                                    />
                                  ) : (
                                    <Avatar
                                      className={classes.avatar}
                                      style={{ backgroundColor: approval.approver.user.initialColor }}
                                    >
                                      {getInitalsFromName(approval.approver.user.name)}
                                    </Avatar>
                                  )}
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      id="simple-modal-title"
                                      className={classes.nameText}
                                    >
                                      <Text message={approval.approver.user.name} />
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      id="simple-modal-title"
                                      className={classes.emailText}
                                    >
                                      <Text message={approval.approver.user.email} />
                                    </Typography>
                                  }
                                />
                                <ListItemText
                                  primary={
                                    <Box>
                                      {(documentStatus === status)
                                        ?
                                        <Box display="flex" flexDirection="row-reverse">
                                          <Typography
                                            variant="h6"
                                            component="h6"
                                            className={classes.stateText}
                                          >
                                            <Text message={poStatusText} />
                                          </Typography>
                                        </Box> : (isCurrentUserIsApprover())
                                          ? (<Box flexGrow={1} textAlign="right">
                                            <FBButton
                                              label="common.reject"
                                              size="small"
                                              variant="outlined"
                                              className={classes.poRejectButton}
                                              onClick={() => approvalTransition("reject", approval.id)}
                                            />
                                            <FBButton
                                              label="form.builder.request.approve"
                                              size="small"
                                              className={classes.poApproveButton}
                                              onClick={() => onApproveClick?.(approval.id || "")}
                                            />
                                          </Box>)
                                          : (isCurrentUserIsNotApprover())
                                            ? (<Box flexGrow={1} textAlign="right">
                                              <Typography
                                                variant="h6"
                                                component="h6"
                                                id="simple-modal-title"
                                                data-cy="training-status"
                                                className={classes.stateText}
                                              >
                                                <Text message={poStatusText} />
                                              </Typography>
                                            </Box>)
                                            : (approval.status === ApprovalStatus.Approved) && (
                                              <Grid
                                                container
                                                direction="row"
                                                justify="flex-end"
                                                alignItems="center"
                                              >
                                                <Typography
                                                  variant="h6"
                                                  component="h6"
                                                  id="simple-modal-title"
                                                  data-cy="training-status"
                                                  className={classes.stateText}
                                                >
                                                  <EmailSuccessIcon
                                                    className={classes.successIcon}
                                                  />
                                                  <Text message={poStatusText} />
                                                </Typography>
                                              </Grid>
                                            )
                                      }
                                    </Box>
                                  }
                                  secondary={ (status === "APPROVED") &&
                                  <Typography
                                    align="right"
                                    variant="h6"
                                    className={classes.dateText}
                                  >
                                    <Text message={getFormattedDateString(
                                      approval.reviewedAt,
                                      MomentFormats.DateTime
                                    )} />
                                  </Typography>
                                  }
                                />
                              </ListItem>
                              {index < (approvals.length - 1) && <Divider className={classes.divider}/>}
                            </List>
                          </>
                        ); }}
                    </FBMapWrapper>
                  </ApprovalsBlock>
                ); }}
            </FBMapWrapper>
          </Box>
        </Box>
      </FBInput>
    </FBProvider>
  );
};
export default withFBPOApprovals(FBPOApprovals);
