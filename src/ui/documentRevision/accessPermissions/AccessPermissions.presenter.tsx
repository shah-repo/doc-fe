import { List, Typography } from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { filter, isEmpty, isEqual, some } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import Select, { components } from "react-select";
import { ReactComponent as CloseIcon } from "../../../assets/images/circle-remove.svg";
import { Group } from "../../../state/ducks/auth/types";
import { Owner, TypographySize } from "../../../state/ducks/common";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import rowStyles from "./AccessPermissions.module.css";
import { styles } from "./AccessPermissions.styles";

interface OwnProps {
  availableApprovers: OptionType[];
  groupOptions: OptionType[];
  securityEmployees: [];
  operators: [];
  securityGroups: [];
  documentId: string;
  documentRevisionId: string;
  isVisible: boolean;
}

export type AccessPermissionsPresenterProps = OwnProps;

export const AccessPermissionsPresenter: React.FunctionComponent<AccessPermissionsPresenterProps> = ({
  availableApprovers,
  groupOptions,
  securityGroups,
  securityEmployees,
  operators,
  documentId,
  documentRevisionId,
  isVisible,
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
    const deleteAccessGroup = filter(security.securityGroups, (group) => (!isEqual(group.id, deletedId)));
    const deleteAccessEmployees = filter(security.securityEmployees, (employee) =>
      (!isEqual(employee.id, deletedId)));
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
    const deleteOperators = filter(security.operators, (operator) =>
      (!isEqual(operator.id, deletedId)));
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

  const isGroup = some(groupOptions, {
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

  const DropdownIndicator = (props) => ( <components.DropdownIndicator
    {...props}
  >
    <button data-cy="add-user" onMouseDown={(e) => handleUpdate(e)} className={classes.accessButton}>
      {(props.selectProps.menuIsOpen || props.hasValue) ?
        <AddBoxOutlinedIcon data-cy="add-user" color="primary" fontSize="small" /> :
        <AddBoxOutlinedIcon color="disabled" fontSize="small" />}
    </button>
  </components.DropdownIndicator>);
  const securityGroupsIds = securityGroups.map((e: Group) => e.id);
  const groupSelectOptions = groupOptions.filter((val) => !securityGroupsIds.includes(val.value));
  const securityEmployeesIds = securityEmployees.map((e: Owner) => e.id);
  const operatorsIds = operators.map((e: Owner) => e.id);

  const employeeSelectOptions = availableApprovers.filter((val) => !securityEmployeesIds.includes(val.value));
  const operatorsSelectOptions = availableApprovers.filter((val) => !operatorsIds.includes(val.value));
  return (
    <div className={classes.container}>
      <Typography variant={TypographySize.md}>
        <Text translation="document.revision.selected.users" />
      </Typography>
      <div style={{ width: 200, paddingBottom: 32 }}>
        {
          !isEmpty(securityEmployees) &&
          <List className={securityGroups.length > 3 ? rowStyles.customRows : undefined}>
            {securityEmployees.map((e: Owner, index) => (
              <div
                key={index}
                className={classes.selectContainer}
              >
                <div style={{ width: 230 }}>{e.user.name}</div>
                <button className={classes.accessButton} onClick={() => handleDelete(e.id)} >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </List>
        }
        <Select
          options={employeeSelectOptions}
          onChange={(e) => saveValue(e)}
          placeholder={intl.formatMessage({
            id: "document.revision.invitation",
          })}
          components={{ DropdownIndicator }}
          value={(accessElement.value === "" || isGroup) ? null : accessElement}
        />
      </div>
      <Typography variant={TypographySize.md}>
        <Text translation="document.revision.selected.groups" />
      </Typography>
      <div style={{ width: 200, paddingBottom: 32 }}>
        {
          !isEmpty(securityGroups) &&
          <List className={securityGroups.length > 3 ? rowStyles.customRows : undefined}>
            {securityGroups.map((e: Group, index) => (
              <div
                key={index}
                className={classes.selectContainer}
              >
                <div style={{ width: 200 }}>{e.name}</div>
                <button className={classes.accessButton} onClick={() => handleDelete(e.id)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </List>
        }
        <Select
          options={groupSelectOptions}
          placeholder={intl.formatMessage({
            id: "document.revision.invitation.group",
          })}
          components={{ DropdownIndicator }}
          onChange={(e) => saveValue(e)}
          value={(accessElement.value === "" || !isGroup) ? null : accessElement}
        />
      </div>
      {
        isVisible &&
        <>
          <Typography variant={TypographySize.md}>
            <Text translation="document.assign.to" />
          </Typography>
          <div style={{ width: 200, paddingBottom: 32 }}>
            {
              !isEmpty(operators) &&
              <List className={operators.length > 3 ? rowStyles.customRows : undefined}>
                {operators.map((e: Owner, index) => (
                  <div
                    key={index}
                    className={classes.selectContainer}
                  >
                    <div style={{ width: 200 }}>{e.user.name}</div>
                    <button className={classes.accessButton} onClick={() => handleDeleteOperatorAccess(e.id)} >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </List>
            }
            <Select
              id="document.assing.to.sidebar"
              options={operatorsSelectOptions}
              onChange={(e) => saveValueOperator(e)}
              placeholder={intl.formatMessage({
                id: "document.revision.invitation",
              })}
              components={{ DropdownIndicator }}
              value={!operator ? null : operator}
            />
          </div>
        </>
      }
    </div>
  );
};

export default AccessPermissionsPresenter;
