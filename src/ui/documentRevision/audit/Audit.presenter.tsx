import { Box, Collapse, IconButton, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { Reference } from "../../../state/ducks/documentRevisions";
import { getAuditDefaultValue } from "../../common/utils/helpers";
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
  const [isOpen, setOpen] = React.useState(true);

  const toggleList = () => setOpen(!isOpen);

  const getNextValue = (change: Audit) => {
    if (!change.nextValue) {
      return "N/A";
    }

    switch (change.field) {
      case "attachments":
        const attachment = change.nextValue as Attachment;
        return attachment.name;
      case "referenceTo":
        const referenceTo = change.nextValue as Reference;
        return referenceTo.docId;
      case "changeRequest":
        const changeRequest = change.nextValue as ChangeRequest;
        return changeRequest.crId;
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
      <Box><Text message={`documentRevision.audit.${change.field}.${change.type}`} /></Box>
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
        <Text translation="documentRevision.audit.docHistory" />
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
