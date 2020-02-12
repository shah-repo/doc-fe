import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import React from "react";
import Select, { components } from "react-select";
import { ReactComponent as CloseIcon } from "../../../assets/images/close_delete.svg";
import { ReactComponent as PlusIcon } from "../../../assets/images/plus_add_icon.svg";
import { Group } from "../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { Owner, TypographySize } from "../../../state/ducks/common";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import rowStyles from "./AccessPermissions.module.css";
import { styles } from "./AccessPermissions.styles";

interface OwnProps {
  availableApprovers: OptionType[];
  loadApproversAsyncState: AsyncState;
  loadAvailableApproversAction: typeof changeRequestsActions.loadAvailableApprovers;
  groupOptions: OptionType[];
  securityEmployees: [];
  securityGroups: [];
  documentId: string;
  documentRevisionId: string;
}

export type AccessPermissionsPresenterProps = OwnProps;

export const AccessPermissionsPresenter: React.FunctionComponent<AccessPermissionsPresenterProps> = ({
  availableApprovers,
  groupOptions,
  securityGroups,
  securityEmployees,
  documentId,
  loadAvailableApproversAction,
  documentRevisionId,
}) => {
  const classes = styles();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [expandedUser, setExpandedUser] = React.useState<boolean>(false);
  const [expandedGroup, setExpandedGroup] = React.useState<boolean>(false);

  const handleChange = () => () => setExpanded(!expanded);
  const handleChangeUser = () => () => setExpandedUser(!expandedUser);
  const handleChangeGroup = () => () => setExpandedGroup(!expandedGroup);

  const security = {
    securityEmployees: securityEmployees.map((e: Group) => {
      return {
        id: e.id,
      };
    }),
    securityGroups: securityGroups.map((e: Group) => {
      return {
        id: e.id,
      };
    }),
  };

  const handleDelete = (deletedId: string) => {
    const deleteAccessGroup = _.filter(security.securityGroups, (group) => (!_.isEqual(group.id, deletedId)));
    const deleteAccessEmployees = _.filter(security.securityEmployees, (employee) =>
      (!_.isEqual(employee.id, deletedId)));
    const securityDeleted = {
      securityEmployees: deleteAccessEmployees,
      securityGroups: deleteAccessGroup,
    };
    async.start(
      updateAction,
      documentId,
      securityDeleted,
      async,
    );
  };
  const getList = useActionCreator(documentRevisionsActions.load);
  const updateAction = useActionCreator(documentRevisionsActions.updateAccess);
  const async = useAsync({onSuccess: () => {
    loadAvailableApproversAction();
    getList(documentRevisionId);
  },
});

  const initialElements = {value: "", text: "", label: ""};
  const [accessElement, saveAccessElement] = React.useState(initialElements);
  const handleUpdate = () => {
    const isGroup = _.some(groupOptions, {
     label: accessElement.label, text: accessElement.text, value: accessElement.value });
    if (isGroup) {
      const securityUpdateGroup = {
        securityEmployees: [...security.securityEmployees],
        securityGroups: [...security.securityGroups, {id: accessElement.value}],
      };
      async.start(
        updateAction,
        documentId,
        securityUpdateGroup,
        async,
      );
    } else {
      const securityUpdateEmployee = {
        securityEmployees: [...security.securityEmployees, {id: accessElement.value}],
        securityGroups: [...security.securityGroups],
      };
      async.start(
        updateAction,
        documentId,
        securityUpdateEmployee,
        async,
      );
    }
    saveAccessElement(initialElements);
  };

  const saveValue = (value) => {
    saveAccessElement(value);
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator
        {...props}
      >
        <button onClick={handleUpdate} className={classes.accessButton}>
          <PlusIcon width="15" height="15" />
        </button>
      </components.DropdownIndicator>
    );
  };
  const securityGroupsIds = securityGroups.map((e: Group) => e.id);
  const groupSelectOptions = groupOptions.filter((val) => !securityGroupsIds.includes(val.value));
  const securityEmployeesIds = securityEmployees.map((e: Owner) => e.id);
  const employeeSelectOptions = availableApprovers.filter((val) => !securityEmployeesIds.includes(val.value));

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
              {!_.isEmpty(securityEmployees) &&
              <List className={securityGroups.length > 3 ? rowStyles.customRows : undefined}>
                {securityEmployees.map((e: Owner, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", marginTop: 16, marginBottom: 16 }}
                  >
                    <div style={{ width: 230 }}>{e.user.name}</div>
                    <button className={classes.accessButton} onClick={() => handleDelete(e.id)} >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </List>}
              <Select
                options={employeeSelectOptions}
                onChange={(e) => saveValue(e)}
                placeholder="Enter name to invite people"
                components={{ DropdownIndicator }}
                value={accessElement.value === "" ? null : accessElement}
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
            {!_.isEmpty(securityGroups) &&
              <List className={securityGroups.length > 3 ? rowStyles.customRows : undefined}>
                {securityGroups.map((e: Group, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", marginTop: 16, marginBottom: 16 }}
                  >
                    <div style={{ width: 230 }}>{e.name}</div>
                    <button className={classes.accessButton} onClick={() => handleDelete(e.id)}>
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </List>}
              <Select
                options={groupSelectOptions}
                placeholder="Enter name to invite group"
                components={{ DropdownIndicator }}
                onChange={(e) => saveValue(e)}
                value={accessElement.value === "" ? null : accessElement}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ExpansionPanel>
    </div>
  );
};

export default AccessPermissionsPresenter;
