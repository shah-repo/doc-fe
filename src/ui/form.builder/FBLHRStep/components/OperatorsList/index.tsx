import React from "react";
import { Avatar, Badge, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import { find } from "lodash";
import { Observer } from "mobx-react";
import { FBInlineApprovalStatusIdent, FBLHRStepState } from "../../../";
import { ReactComponent as OperatorApprovedIcon } from "../../../../../assets/images/OperatorApproved.svg";
import { getFormattedDateString, MomentFormats } from "../../../../../common/utils/date";
import { Nullable, User } from "../../../../../state/ducks/common/types";
import { getInitalsFromName } from "../../../../components/icons/avatar/helpers";
import styles from "./styles";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";

interface OperatorsListProps {
  operators: { stepId: string; user: User }[];
  stepLHRs?: Nullable<DocumentRevision>;
  lhrStepState?: FBLHRStepState;
  stepIndex?: number;
}

const OperatorsList: React.FC<OperatorsListProps> = (props) => {
  const { operators, stepLHRs, lhrStepState, stepIndex } = props;
  const classes = styles();

  const getStatusInfo = (opert, operatorId: string) => {
    const approvers = stepLHRs?.id && opert ? opert[stepLHRs?.id] : [];
    return find(approvers, (o) => o.approverId === operatorId && o.status !== FBInlineApprovalStatusIdent.ABANDONED);
  };

  return (
    <List>
      <Observer>
        {() => (
          <>
            {operators?.map((operator, index) => {
              const { stepId, user } = operator;
              const statusInfo = getStatusInfo(lhrStepState?.approvals, stepId);

              return (
                <ListItem key={user?.id} className={classes.listItem} disableGutters>
                  <ListItemAvatar data-cy={`operator-avatar-${stepIndex}-${index}`}>
                    <Badge
                      overlap="circle"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      badgeContent={
                        statusInfo?.status === FBInlineApprovalStatusIdent.APPROVED && <OperatorApprovedIcon />
                      }
                    >
                      <Avatar
                        className={classes.avatar}
                        style={{ background: user?.initialColor }}
                        alt={user.name}
                        src={user.avatar ?? undefined}
                      >
                        {getInitalsFromName(user.name)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    className={classes.listItemText}
                    primary={
                      <div className={classes.operatorTitle} data-cy={`operator-name-${stepIndex}-${index}`}>
                        {user?.name}
                      </div>
                    }
                    secondary={
                      <Observer>
                        {() => (
                          <div data-cy={`operator-sub-title-${stepIndex}-${index}`}>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.operatorStatus}
                              data-cy={`operator-status-${stepIndex}-${index}`}
                            >
                              {statusInfo?.status?.toLowerCase()}
                            </Typography>
                            {statusInfo?.reviewedAt && (
                              <>
                                <Box component="span" marginLeft={1} marginRight={1}>&bull;</Box>
                                {getFormattedDateString(statusInfo?.reviewedAt, MomentFormats.DateTime)}
                              </>
                            )}
                          </div>
                        )}
                      </Observer>
                    }
                  />
                </ListItem>
              );
            })}
          </>
        )}
      </Observer>
    </List>
  );
};

export default OperatorsList;
