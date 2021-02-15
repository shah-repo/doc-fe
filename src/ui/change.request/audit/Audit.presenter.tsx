import { Box, List } from "@material-ui/core";
import { isEmpty, orderBy } from "lodash";
import React from "react";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { Approval, ApprovalStatus } from "../../../state/ducks/common";
import AuditFactory from "../../components/AuditFactory";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";

interface OwnProps {
  audit: AuditGroupType;
  approvals: Approval[];
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
  approvals,
}) => {
  const classes = styles();

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId, key) => {
      const change = audit[groupId][0];
      return (
        <Box key={groupId} className={classes.changeContainer}>
          <div className={classes.dateContainer} data-cy={`audit-${key}`}>
            <div data-cy={`audit-owner-${key}`} className={classes.owner}>{change.owner?.user.name}</div>
            <DateTime data-cy={`audit-time-${key}`} value={change.timestamp} />
          </div>

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
        const isRemovingApproverAction = change.field === "approvals.status" &&
        change.nextValue === ApprovalStatus.Abandoned;
        if (isRemovingApproverAction) {
          const removedApproverByDate = approvals.filter((e) =>
            getFormattedDateString(e.updatedAt, MomentFormats.DateTimeSeconds) ===
            getFormattedDateString(change.timestamp, MomentFormats.DateTimeSeconds));
          if (!isEmpty(removedApproverByDate)) {
            change = {
              ...change,
              approvalStatus: change.nextValue as string,
              nextValue: {
                ...removedApproverByDate[0].approver,
              },
            };
          }
        }
        singleFields.push(
          <Box mb={1} key={`${change.groupId}-${index}`}>
            <Box>
              <Text
                message={
                  isRemovingApproverAction
                  // hack, since BE cannot make correct data for removing approvers
                    ? "changeRequest.audit.approvers.ARRAY_DELETED"
                    : `changeRequest.audit.${change.field}.${change.type}`
                }
              />
            </Box>
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
    <div className={classes.container}>
      <List>{audit && renderAuditGroup()}</List>
    </div>
  );
};

export default AuditPresenter;
