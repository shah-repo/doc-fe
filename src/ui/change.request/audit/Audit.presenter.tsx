import { Box, List, Typography } from "@material-ui/core";
import { orderBy } from "lodash";
import React from "react";
import { MomentFormats } from "../../../common/utils/date";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { Approval, ApprovalStatus } from "../../../state/ducks/common/types";
import AuditFactory from "../../components/AuditFactory";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import UserAvatarListItem from "../../documentRevision/Sidebar/common/UserAvatarListItem";
import { styles } from "./Audit.presenter.styles";

interface OwnProps {
  audit: AuditGroupType;
  approvals: Approval[];
  isDrawerOpen: boolean;
}

type AuditPresenterProps = OwnProps;

const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
  approvals,
  isDrawerOpen,
}) => {
  const classes = styles();

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId, key) => {
      const change = audit[groupId][0];
      const { owner, ownerUser, ownerThirdParty } = change;
      const name = ((owner && owner.user) || ownerUser || ownerThirdParty)?.name;
      return (
        <Box key={groupId} className={isDrawerOpen ? classes.changeContainer : classes.container}>
          <UserAvatarListItem
            data-cy={`audit-${key}`}
            name={<div data-cy={`audit-owner-${key}`}>{name}</div>}
            user={(owner && owner.user) || ownerUser || ownerThirdParty}
            secondaryComponent={
              <DateTime
                data-cy={`audit-${key}`}
                value={change.timestamp}
                format={MomentFormats.BriefDateTime}
              />
            }
          />
          {renderChanges(audit[groupId])}
        </Box>
      );
    });

  const renderChanges = (audits: Audit[]) => {
    const references: Audit[] = [];
    const attachments: Audit[] = [];
    const singleFields: JSX.Element[] = [];

    orderBy(audits, ["field"]).forEach((change, index) => {
      if (change.field.includes("attachments")) {
        attachments.push(change);
      } else if (change.field.includes("referenceTo")) {
        references.push(change);
        // } else if (change.field.includes("approvals")) {
        //   // This is a hack to not display approvers twice in history
        //   // Until BE removes field approvals
        //   return;
      } else if (change.field !== "effectiveDate" || change.nextValue !== "null") {
        const isRemovingApproverAction = (
          change.field === "approvals.status" && change.nextValue === ApprovalStatus.Abandoned
        );
        if (isRemovingApproverAction) {
          const removedApproverById = approvals.find(({ id }) => id === change.relatedEntity?.id );
          if (removedApproverById) {
            change = {
              ...change,
              approvalStatus: change.nextValue as string,
              nextValue: {
                ...removedApproverById.approver,
              },
            };
          }
        }
        singleFields.push(
          <Box
            mb={1}
            key={`${change.groupId}-${index}`}
            data-cy="no-padding-margin"
            className={
              index === audits.length - 1
                ? classes.noPaddingMargin
                : classes.auditListItem
            }
          >
            <Typography
              variant="subtitle1"
              className={classes.auditKey}
            >
              <Text
                message={
                  isRemovingApproverAction
                  // hack, since BE cannot make correct data for removing approvers
                    ? "changeRequest.audit.approvers.ARRAY_DELETED"
                    : `changeRequest.audit.${change.field}.${change.type}`
                }
              />
            </Typography>
            <div className={classes.auditValue}>
              <AuditFactory audit={change} />
            </div>
          </Box>,
        );
      }
    });

    return (
      <Box>
        {singleFields}
        {attachments.length > 0 && renderGroupChanges(attachments)}
        {references.length > 0 && renderGroupChanges(references)}
      </Box>
    );
  };

  const renderGroupChanges = (auditGroup: Audit[]) => {
    const field = auditGroup[0].field;
    const type = auditGroup[0].type;

    return (
      <Box mb={1} key={`${auditGroup[0].groupId}`}>
        <Box>
          <Text message={`changeRequest.audit.${field}.${type}`} />
        </Box>
        {auditGroup.map((change, index) => (
          <div
            key={change.groupId + `-${index}`}
            className={classes.auditValue}
          >
            <AuditFactory audit={change} />
          </div>
        ))}
      </Box>
    );
  };

  return (
    <List disablePadding>{audit && renderAuditGroup()}</List>
  );
};

export default AuditPresenter;
