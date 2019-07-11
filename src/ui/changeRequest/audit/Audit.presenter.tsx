import { Collapse, IconButton, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { Audit } from "../../../state/ducks/changeRequest";
import { Approval, User } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";

interface OwnProps {
  audit: Audit[];
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
}) => {
  const classes = styles();
  const [isOpen, setOpen] = React.useState(false);

  const toggleList = () => setOpen(!isOpen);

  const getNextValue = (change: Audit) => {
    switch (change.field) {
      case "attachments":
        const attachment = change.nextValue as Attachment;
        return attachment.name;
      case "approvals":
        const approval = change.nextValue as Approval;
        return approval.approver.name;
      case "approvers":
        const approver = change.nextValue as User;
        return approver.name;
      case "documentRevisions":
        const documentRevision = change.nextValue as DocumentRevision;
        return documentRevision.description;
      default:
        return change.nextValue;
    }
  };
  const renderChange = () => (
    audit && audit.map((change, index) => {
      const nextValue = getNextValue(change);

      return (
        <div
          key={index}
          className={classes.changeContainer}
        >
          <div className={classes.dateContainer}>
            <DateTime value={change.timestamp} />
          </div>
          <div>
            <Text message={`changeRequest.audit.${change.field}.${change.type}`} />
          </div>
          {nextValue}
        </div>
      );
    })
  );
  const renderExpandIcon = () => (
    isOpen ? <ExpandLess /> : <ExpandMore />
  );

  return (
    <div className={classes.container}>
      <IconButton onClick={toggleList} classes={{ root: classes.collapsableButton }}>
        <Text translation="changeRequest.audit.crHistory" />
        {renderExpandIcon()}
      </IconButton>
      <div className={classes.collapsableContainer}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit={true}>
          <List>
            {renderChange()}
          </List>
        </Collapse>
      </div>
    </div>
  );
};

export default AuditPresenter;
