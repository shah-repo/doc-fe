import { Collapse, IconButton, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";
import _ from "lodash";
import { Attachment } from "../../../state/ducks/attachments";
import { Audit, Reference } from "../../../state/ducks/documentRevisions";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { getAuditDefaultValue } from "../../common/utils/helpers";

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
    if (!change.nextValue)
      return "N/A";
    
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
  const renderChanges = () =>
    audit.map((change, index) => {
      const nextValue = getNextValue(change);

      return (
        <div key={index} className={classes.changeContainer}>
          <div className={classes.dateContainer}>
            <span className={classes.owner}>{change.owner.name}</span> -{" "}
            <DateTime value={change.timestamp} />
          </div>
          <div>
            <Text
              message={`documentRevision.audit.${change.field}.${change.type}`}
            />
          </div>
          <div className={classes.auditValue}>{nextValue}</div>
        </div>
      );
    });
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
          <List>{audit && renderChanges()}</List>
        </Collapse>
      </div>
    </div>
  );
};

export default AuditPresenter;
