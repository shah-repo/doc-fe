import { Box, List, Typography } from "@material-ui/core";
import React from "react";
import { MomentFormats } from "../../../common/utils/date";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import AuditFactory from "../../components/AuditFactory";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";

interface OwnProps {
  audit: AuditGroupType;
  statusLabel: string;
  versionNumber: string;
  isStatusVisible: boolean;
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
  statusLabel,
  versionNumber,
  isStatusVisible,
}) => {
  const classes = styles();

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId, key) => {
      const change = audit[groupId][0];
      const { owner, ownerUser, ownerThirdParty } = change;
      const { name } = ((owner && owner.user) || ownerUser || ownerThirdParty);
      const hasOnlyFBChanges = audit[groupId].every((change) => change.field.includes("formInput"));

      if (hasOnlyFBChanges) {
        return null;
      }

      return (
        <Box key={groupId} className={classes.changeContainer}>
          <div className={classes.dateContainer}>
            <div className={classes.owner} data-cy={`owner-${key}`}>{name}</div>
            <DateTime value={change.timestamp} format={MomentFormats.DateTime12h} data-cy={`time-${key}`}/>
          </div>
          {renderChanges(audit[groupId], key)}
        </Box>
      );
    });

  const renderChanges = (audits: Audit[], groupKey?: number) => {
    const newReferences: Audit[] = [];
    const deletedReferences: Audit[] = [];
    const attachments: Audit[] = [];
    const singleFields: JSX.Element[] = [];
    let key = 0;

    audits.forEach((change: Audit, index) => {
      change.groupKey = groupKey;
      if (change.field.includes("attachments")) {
        attachments.push(change);
      } else if (change.field.includes("referenceTo") && change.type === "ARRAY_NEW") {
        newReferences.push(change);
      } else if (change.field.includes("referenceTo") && change.type === "ARRAY_DELETED") {
        deletedReferences.push(change);
      } else if (change.field.includes("formInput")) {
        return;
      } else {
        singleFields.push((
          <Box mb={1} key={`${change.groupId}-${index}`}>
            <Box>
              <Text dataCy={`change-key-${groupKey}-${key}`}
                message={`documentRevision.audit.${change.field}.${change.type}`}
              />
            </Box>
            <div className={classes.auditValue}>
              <AuditFactory audit={change} dataCy={`change-value-${groupKey}-${key}`} />
            </div>
          </Box>
        ));
        key++;
      }
    });

    // This key is added to keep sequential data-cy identifier in the history
    attachments.forEach((change) => {
      change.index = key++;
    });
    newReferences.forEach((change) => {
      change.index = key++;
    });
    deletedReferences.forEach((change) => {
      change.index = key++;
    });

    return (
      <Box>
        {singleFields}
        {attachments.length > 0 && renderGroupChanges(attachments)}
        {newReferences.length > 0 && renderGroupChanges(newReferences)}
        {deletedReferences.length > 0 && renderGroupChanges(deletedReferences)}
      </Box>
    );
  };

  const renderGroupChanges = (auditGroup: Audit[]) => {
    const field = auditGroup[0].field;
    const type = auditGroup[0].type;
    const parentGroupKey = auditGroup[0].groupKey;
    const parentIndex = auditGroup[0].index;

    return (
      <Box mb={1} key={`${auditGroup[0].groupId}`}>
        <Box>
          <Text dataCy={`change-key-${parentGroupKey}-${parentIndex}`}
            message={`documentRevision.audit.${field}.${type}`} />
        </Box>
        {auditGroup.map((change, index) => (
          <div
            key={change.groupId + `-${index}`}
            className={classes.auditValue}
          >
            <AuditFactory audit={change} dataCy={`change-value-${change.groupKey}-${change.index}`} />
          </div>
        ))}
      </Box>
    );
  };

  return (
    <div className={classes.container}>
      {audit && <Box className={classes.revisionContainer}>
        <Typography variant="subtitle1" className={classes.title}>
          <Text message={"common.revision"} />
          &nbsp;
          {versionNumber}
          {
            isStatusVisible &&
            <>
              &nbsp; - <Text message={statusLabel} />
            </>
          }
        </Typography>
      </Box>}
      <List className={classes.list}>{audit && renderAuditGroup()}</List>
    </div>
  );
};

export default AuditPresenter;
