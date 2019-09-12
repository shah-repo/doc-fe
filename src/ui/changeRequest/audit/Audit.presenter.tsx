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
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { styles } from "./Audit.presenter.styles";
import { getNextValue } from "../../common/utils/audit";

interface OwnProps {
  audit: AuditGroupType;
}

export type AuditPresenterProps = OwnProps;

export const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
}) => {
  const classes = styles();

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
      <Box><Text message={`changeRequest.audit.${change.field}.${change.type}`} /></Box>
      <div className={classes.auditValue}>{getNextValue(change)}</div>
    </Box>
  ));

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleChange = () => () => setExpanded(!expanded);

  return (
    <div className={classes.container}>
      <ExpansionPanel expanded={expanded} onChange={handleChange()}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
        <Typography variant={TypographySize.md}>
          <Text translation="changeRequest.audit.crHistory" />
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
