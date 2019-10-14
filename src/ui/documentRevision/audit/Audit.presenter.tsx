import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { TypographySize } from "../../../state/ducks/common";
import AuditFactory from "../../components/AuditFactory";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";

interface OwnProps {
  audit: AuditGroupType;
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
}) => {
  const classes = styles();
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId) => {
      const change = audit[groupId][0];
      const auditField = audit[groupId][0].field;

      return (
        <Box key={groupId} className={classes.changeContainer}>
          <div className={classes.dateContainer}>
            <div className={classes.owner}>{change.owner.name}</div>
            <DateTime value={change.timestamp} />
          </div>
          {renderChanges(audit[groupId])}
        </Box>
      );
    });

  const renderChanges = (audits: Audit[]) => {
    const references: Audit[] = [];
    const attachments: Audit[] = [];

    const singleFields = audits.map((change, index) => {
      if (change.field.includes("attachments")) {
        attachments.push(change);
      } else if (change.field.includes("referenceTo")) {
        references.push(change);
      } else {
        return (
          <Box mb={1} key={`${change.groupId}-${index}`}>
            <Box>
              <Text
                message={`documentRevision.audit.${change.field}.${change.type}`}
              />
            </Box>
            <div className={classes.auditValue}>
              <AuditFactory audit={change} />
            </div>
          </Box>
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
          <Text message={`documentRevision.audit.${field}.${type}`} />
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

  const handleChange = () => () => setExpanded(!expanded);

  return (
    <div className={classes.container}>
      <ExpansionPanel expanded={expanded} onChange={handleChange()}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={TypographySize.md}>
            <Text translation="documentRevision.audit.docHistory" />
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <List>{audit && renderAuditGroup()}</List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default AuditPresenter;
