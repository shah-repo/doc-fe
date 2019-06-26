import React from "react";
import { Collapse, List, IconButton } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Audit } from "../../../state/ducks/changeRequest";
import { Attachment } from "../../../state/ducks/attachments";
import { Approval, User } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import Date from "../../components/Date";

interface OwnProps {
  audit: Audit[];
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
}) => {
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
    audit.map((change, index) => {
      let nextValue = getNextValue(change);

      return (
        <div
          key={index}
          style={{
            borderBottom: '1px solid lightgray',
            marginBottom: 20,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <Date value={change.timestamp} />
          </div>
          <div>
            <Text message={`changeRequest.audit.${change.field}.${change.type}`} />
          </div>
          {nextValue}
        </div>
      );
    })
  )
  const renderExpandIcon = () => (
    isOpen ? <ExpandLess /> : <ExpandMore />
  )

  return (
    <div style={{ marginLeft: 50 }}>
      <IconButton onClick={toggleList} style={{ width: "100%", borderRadius: 0, justifyContent: 'end' }}>
        <Text translation="changeRequest.audit.crHistory" />
        {renderExpandIcon()}
      </IconButton>
      <div style={{ maxHeight: 700, overflowY: 'auto' }}>
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
