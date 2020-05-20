import { List, Typography } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import Select, { components } from "react-select";
import { ReactComponent as CloseIcon } from "../../../assets/images/circle-remove.svg";
import { ReactComponent as PlusIcon } from "../../../assets/images/plus_add_icon.svg";
import { Group } from "../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { Owner, TypographySize } from "../../../state/ducks/common";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
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
  operators: [];
  securityGroups: [];
  documentId: string;
  documentRevisionId: string;
  loadGroupsAction: typeof userManagementActions.loadCompanyGroups;
  loadGroupAsyncState: AsyncState;
}

export type AccessPermissionsPresenterProps = OwnProps;

export const AccessPermissionsPresenter: React.FunctionComponent<AccessPermissionsPresenterProps> = ({
  availableApprovers,
  groupOptions,
  securityGroups,
  securityEmployees,
  operators,
  documentId,
  loadAvailableApproversAction,
  documentRevisionId,
  loadApproversAsyncState,
  loadGroupAsyncState,
  loadGroupsAction,
}) => {
  const classes = styles();

  const security = {
    securityEmployees: securityEmployees.map((e: Group) => ({
      id: e.id,
    })),
    securityGroups: securityGroups.map((e: Group) => ({
      id: e.id,
    })),
    operators: operators.map((e: Group) => ({
      id: e.id,
    })),
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

  const handleDeleteOperatorAccess = (deletedId: string) => {
    const deleteOperators = _.filter(security.operators, (operator) =>
      (!_.isEqual(operator.id, deletedId)));
    const securityDeleted = {
      operators: deleteOperators,
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
  const async = useAsync({
    onSuccess: () => {
      getList(documentRevisionId);
    },
  });

  const initialElements = { value: "", text: "", label: "" };
  const [accessElement, saveAccessElement] = React.useState(initialElements);
  const [operator, saveOperator] = React.useState<any>(null);

  const isGroup = _.some(groupOptions, {
    label: accessElement.label, text: accessElement.text, value: accessElement.value,
  });
  const handleUpdate = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isGroup) {
      const securityUpdateGroup = {
        securityEmployees: [...security.securityEmployees],
        securityGroups: [...security.securityGroups, { id: accessElement.value }],
        operators: [...security.operators],

      };
      async.start(
        updateAction,
        documentId,
        securityUpdateGroup,
        async,
      );
    } else if (operator) {

      const securityUpdateOperator = {
        securityEmployees: [...security.securityEmployees],
        securityGroups: [...security.securityGroups],
        operators: [...security.operators, { id: operator.value }],
      };
      async.start(
        updateAction,
        documentId,
        securityUpdateOperator,
        async,
      );
      saveOperator(null);

    } else {
      const securityUpdateEmployee = {
        securityEmployees: [...security.securityEmployees, { id: accessElement.value }],
        securityGroups: [...security.securityGroups],
        operators: [...security.operators],

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

  const saveValueOperator = (value) => {
    saveOperator(value);
  };
  const intl = useIntl();

  const DropdownIndicator = (props) => (
    <components.DropdownIndicator
      {...props}
    >
      <button onMouseDown={(e) => handleUpdate(e)} className={classes.accessButton}>
        <PlusIcon width="15" height="15" />
      </button>
    </components.DropdownIndicator>
  );
  const securityGroupsIds = securityGroups.map((e: Group) => e.id);
  const groupSelectOptions = groupOptions.filter((val) => !securityGroupsIds.includes(val.value));
  const securityEmployeesIds = securityEmployees.map((e: Owner) => e.id);
  const operatorsIds = operators.map((e: Owner) => e.id);

  const employeeSelectOptions = availableApprovers.filter((val) => !securityEmployeesIds.includes(val.value));
  const operatorsSelectOptions = availableApprovers.filter((val) => !operatorsIds.includes(val.value));
  return (
    <div className={classes.container}>
      <Typography variant={TypographySize.md} style={{ paddingBottom: 16 }}>
        <Text translation="document.revision.selected.users" />
      </Typography>
      <div style={{ width: 240, paddingBottom: 32 }}>
        {!_.isEmpty(securityEmployees) &&
                <List className={securityGroups.length > 3 ? rowStyles.customRows : undefined}>
                  {securityEmployees.map((e: Owner, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        marginTop: 16,
                        marginBottom: 16,
                        padding: 5,
                        background: "#EDF4FF",
                        borderRadius: 2,
                      }}
                    >
                      <div style={{ width: 230 }}>{e.user.name}</div>
                      <button className={classes.accessButton} onClick={() => handleDelete(e.id)} >
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </List>}
        <AsyncGate
          asyncState={loadApproversAsyncState}
          asyncAction={loadAvailableApproversAction}
          startActionOnMount={true}
        >
          <Select
            options={employeeSelectOptions}
            onChange={(e) => saveValue(e)}
            placeholder={intl.formatMessage({
              id: "document.revision.selected.users.placeholder",
            })}
            components={{ DropdownIndicator }}
            value={(accessElement.value === "" || isGroup) ? null : accessElement}
          />
        </AsyncGate>
      </div>
      <Typography variant={TypographySize.md} style={{ paddingBottom: 16 }}>
        <Text translation="document.revision.selected.groups" />
      </Typography>
      <div style={{ width: 240, paddingBottom: 32 }}>
        {!_.isEmpty(securityGroups) &&
                <List className={securityGroups.length > 3 ? rowStyles.customRows : undefined}>
                  {securityGroups.map((e: Group, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        marginTop: 16,
                        marginBottom: 16,
                        padding: 5,
                        background: "#EDF4FF",
                        borderRadius: 2,
                      }}
                    >
                      <div style={{ width: 230 }}>{e.name}</div>
                      <button className={classes.accessButton} onClick={() => handleDelete(e.id)}>
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </List>}
        <AsyncGate
          asyncState={loadGroupAsyncState}
          asyncAction={loadGroupsAction}
          startActionOnMount={true}
        >
          <Select
            options={groupSelectOptions}
            placeholder={intl.formatMessage({
              id: "document.revision.selected.users.placeholder",
            })}
            components={{ DropdownIndicator }}
            onChange={(e) => saveValue(e)}
            value={(accessElement.value === "" || !isGroup) ? null : accessElement}
          />
        </AsyncGate>
      </div>
      <Typography variant={TypographySize.md} style={{ paddingBottom: 16 }}>
        <Text translation="document.assign.to" />
      </Typography>
      <div style={{ width: 240, paddingBottom: 32 }}>
        {!_.isEmpty(operators) &&
                <List className={operators.length > 3 ? rowStyles.customRows : undefined}>
                  {operators.map((e: Owner, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        marginTop: 16,
                        marginBottom: 16,
                        padding: 5,
                        background: "#EDF4FF",
                        borderRadius: 2,
                      }}
                    >
                      <div style={{ width: 230 }}>{e.user.name}</div>
                      <button className={classes.accessButton} onClick={() => handleDeleteOperatorAccess(e.id)} >
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </List>}
        <AsyncGate
          asyncState={loadApproversAsyncState}
          asyncAction={loadAvailableApproversAction}
          startActionOnMount={true}
        >
          <Select
            options={operatorsSelectOptions}
            onChange={(e) => saveValueOperator(e)}
            placeholder={intl.formatMessage({
              id: "document.revision.selected.users.placeholder",
            })}
            components={{ DropdownIndicator }}
            value={!operator ? null : operator}
          />
        </AsyncGate>
      </div>
    </div>
  );
};

export default AccessPermissionsPresenter;
