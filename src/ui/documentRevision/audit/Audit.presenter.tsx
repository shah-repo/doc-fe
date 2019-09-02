import {
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { TypographySize } from "../../../state/ducks/common";
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
  const [expanded, setExpanded] = React.useState<boolean>(false);

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
          <div className={classes.owner}>{change.owner.name}</div>
          <DateTime value={change.timestamp} />
        </div>
        {renderChanges(audit[groupId])}
      </Box>
    );
  });

  const renderChanges = (audits: Audit[]) => audits.map((change, index) => (
    <Box mb={1} key={`${change.groupId}-${index}`}>
      <Box><Text message={`documentRevision.audit.${change.field}.${change.type}`} /></Box>
      <div className={classes.auditValue}>{getNextValue(change)}</div>
    </Box>
  ));

  const handleChange = () => () => setExpanded(!expanded);

  return (
    <div className={classes.container}>
      <ExpansionPanel expanded={expanded} onChange={handleChange()}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
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
