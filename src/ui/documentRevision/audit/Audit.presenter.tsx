import React from "react";
import { Collapse, List, IconButton } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Audit } from "../../../state/ducks/documentRevisions";
import { Attachment } from "../../../state/ducks/attachments";
import Text from "../../components/Text";
import Date from "../../components/Date";
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
      default:
        return change.nextValue;
    }
  };
  const renderChanges = () => (
    audit.map((change, index) => {
      let nextValue = getNextValue(change);

      return (
        <div
          key={index}
          className={classes.changeContainer}
        >
          <div className={classes.dateContainer}>
            <Date value={change.timestamp} />
          </div>
          <div>
            <Text message={`documentRevision.audit.${change.field}.${change.type}`} />
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
