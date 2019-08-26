import { Box, Collapse, IconButton, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { Approval, User } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";
import { getAuditDefaultValue } from "../../common/utils/helpers";

interface OwnProps {
  audit: AuditGroupType;
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
}) => {
  const classes = styles();
  const [isOpen, setOpen] = React.useState(false);

  const toggleList = () => setOpen(!isOpen);

  const getNextValue = (change: Audit) => {
    if (!change.nextValue)
      return "N/A";
    
    switch (change.field) {
      case "attachments":
      case "justifications.attachments":
      case "assessments.process.attachments":
      case "assessments.design.attachments":
      case "assessments.regulatory.attachments":
        const attachment = change.nextValue as Attachment;
        return `${attachment.name}.${attachment.type}`;
      case "approvals":
        const approval = change.nextValue as Approval;
        return approval.approver.name;
      case "approvers":
      case "tasks.assigned":
        const approver = change.nextValue as User;
        return approver.name;
      case "documentRevisions":
        const documentRevision = change.nextValue as DocumentRevision;
        return documentRevision.name;
      case "tasks.dueDate":
      case "effectiveDate":
        return <DateTime value={change.nextValue as string} />;
      default:
        return getAuditDefaultValue(change.nextValue);
    }
  };

  const renderAuditGroup = () => Object.keys(audit).map((groupId) => {
    const change = audit[groupId][0];

    return (
      <Box key={groupId} className={classes.changeContainer}>
        <div className={classes.dateContainer}>
          <span className={classes.owner}>{change.owner.name}</span> -{" "}
          <DateTime value={change.timestamp} />
        </div>
        {renderChanges(audit[groupId])}
      </Box>
    );
  });

  const renderChanges = (audits: Audit[]) => audits.map((change, index) => (
    <Box key={`${change.groupId}-${index}`}>
      <Box><Text message={`changeRequest.audit.${change.field}.${change.type}`} /></Box>
      <div className={classes.auditValue}>{getNextValue(change)}</div>
    </Box>
  ));

  const renderExpandIcon = () => (isOpen ? <ExpandLess /> : <ExpandMore />);

  return (
    <div className={classes.container}>
      <IconButton
        onClick={toggleList}
        classes={{ root: classes.collapsableButton }}
      >
        <Text translation="changeRequest.audit.crHistory" />
        {renderExpandIcon()}
      </IconButton>
      <div className={classes.collapsableContainer}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit={true}>
          <List>{audit && renderAuditGroup()}</List>
        </Collapse>
      </div>
    </div>
  );
};

export default AuditPresenter;
