import { Collapse, IconButton, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { Audit, Reference } from "../../../state/ducks/documentRevisions";
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
  const [isOpen, setOpen] = React.useState(true);

  const toggleList = () => setOpen(!isOpen);

  const getNextValue = (change: Audit) => {
    switch (change.field) {
      case "attachments":
        const attachment = change.nextValue as Attachment;
        return attachment.name;
      case "referenceTo":
        const referenceTo = change.nextValue as Reference;
        return referenceTo.docId;
      default:
        return change.nextValue;
    }
  };
  const renderChanges = () => (
    audit.map((change, index) => {
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
            <Text message={`documentRevision.audit.${change.field}.${change.type}`} />
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
        <Text translation="documentRevision.audit.docHistory" />
        {renderExpandIcon()}
      </IconButton>
      <div className={classes.collapsableContainer}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit={true}>
          <List>
            {audit && renderChanges()}
          </List>
        </Collapse>
      </div>
    </div>
  );
};

export default AuditPresenter;
