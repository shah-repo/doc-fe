import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import Select, { components } from "react-select";
import { ReactComponent as CloseIcon } from "../../../assets/images/close_delete.svg";
import { ReactComponent as PlusIcon } from "../../../assets/images/plus_add_icon.svg";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { TypographySize } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
// import AsyncGate from "../../components/AsyncGate";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import rowStyles from "./AccessPermissions.module.css";
import { styles } from "./AccessPermissions.styles";

interface OwnProps {
  canAccess: boolean;
  availableApprovers: OptionType[];
  loadApproversAsyncState: AsyncState;
  loadAvailableApproversAction: typeof changeRequestsActions.loadAvailableApprovers;
  groupOptions: OptionType[];
}

export type AccessPermissionsPresenterProps = OwnProps;

export const AccessPermissionsPresenter: React.FunctionComponent<AccessPermissionsPresenterProps> = ({
  canAccess,
  availableApprovers,
  groupOptions,
}) => {
  const classes = styles();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [expandedUser, setExpandedUser] = React.useState<boolean>(false);
  const [expandedGroup, setExpandedGroup] = React.useState<boolean>(false);

  const handleChange = () => () => setExpanded(!expanded);
  const handleChangeUser = () => () => setExpandedUser(!expandedUser);
  const handleChangeGroup = () => () => setExpandedGroup(!expandedGroup);
  const [group, saveGroup] = useState({});
  const onChange = (e) => {
    saveGroup(e);
  };
  console.log(group, availableApprovers);
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator
        {...props}
        onClick={console.log(
          "pozvati grupu sa backenda s grupama i okinit da spremi",
        )}
      >
        <PlusIcon width="15" height="15" />
      </components.DropdownIndicator>
    );
  };
  return (
    <div className={classes.container}>
      <ExpansionPanel expanded={expanded} onChange={handleChange()}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={TypographySize.md}>
            <Text translation="document.access.permissions" />
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanel
          expanded={expandedUser}
          onChange={handleChangeUser()}
          style={{ marginLeft: 16 }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={TypographySize.md}>
              <Text translation="document.access.user.permissions" />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            className={classes.details}
            style={{ marginLeft: 5, overflow: "unset" }}
          >
            <div style={{ width: 272 }}>
              <List className={rowStyles.customRows}>
                {groupOptions.map((e, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", marginTop: 16, marginBottom: 16 }}
                  >
                    <div style={{ width: 230 }}>{e.label}</div>
                    <button className={classes.accessButton}>
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </List>
              <Select
                options={availableApprovers}
                onChange={onChange}
                placeholder="Enter name to invite people"
                components={{ DropdownIndicator }}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expandedGroup}
          onChange={handleChangeGroup()}
          style={{ marginLeft: 16 }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={TypographySize.md}>
              <Text translation="document.access.group.permissions" />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            className={classes.details}
            style={{ marginLeft: 5, overflow: "unset" }}
          >
            <div style={{ width: 272 }}>
              <List className={rowStyles.customRows}>
                {groupOptions.map((e, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", marginTop: 16, marginBottom: 16 }}
                  >
                    <div style={{ width: 230 }}>{e.label}</div>
                    <button className={classes.accessButton}>
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </List>
              <Select
                options={groupOptions}
                onChange={onChange}
                placeholder="Enter name to invite group"
                components={{ DropdownIndicator }}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ExpansionPanel>
    </div>
  );
};

export default AccessPermissionsPresenter;
