import { Avatar, Box, Collapse, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { filter, isEmpty, isEqual, some } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import Select, { components } from "react-select";
import { ReactComponent as CloseIcon } from "../../../assets/images/circle-remove.svg";
import { Group } from "../../../state/ducks/auth/types";
import { Owner, TypographySize } from "../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
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
  label?: string;
}

type AccessPermissionsPresenterProps = OwnProps;

const AccessPermissionsPresenter: React.FunctionComponent<AccessPermissionsPresenterProps> = ({
  availableApprovers,
  groupOptions,
  securityGroups,
  securityEmployees,
  operators,
  documentId,
  documentRevisionId,
  isVisible,
  label,
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

  const [open, setOpen] = React.useState(true);
  const [open1, setOpen1] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick1 = () => {
    setOpen1(!open1);
  };

  return (
    <Box flexGrow={1}>
      <List disablePadding>
        <ListItem disableGutters style={{ paddingLeft: "15px", marginTop: "15px", paddingTop: "0px" }}>
          <ListItemText>
            <Typography className={classes.itemTitle}>
              <Text translation="document.revision.selected.users" />
            </Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            {open ? (
              <ExpandLess onClick={handleClick} />
            ) : (
              <ExpandMore onClick={handleClick} />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItem disableGutters style={{ padding: "0px 15px 0px 15px" }}>
              <ListItemText>
                <Box>
                  <Box width={203} height={40}>
                    <Select
                      options={employeeSelectOptions}
                      onChange={(e) => saveValue(e)}
                      placeholder={intl.formatMessage({
                        id: "document.revision.search.users",
                      })}
                      components={{ DropdownIndicator }}
                      value={
                        accessElement.value === "" || isGroup
                          ? null
                          : accessElement
                      }
                    />
                  </Box>
                  {!isEmpty(securityEmployees) && (
                    <Box>
                      {securityEmployees.map((e: Owner, index) => (
                        <Grid
                          key={index}
                          justify="space-between"
                          alignItems="center"
                          container
                          style={{ paddingTop: "15px" }}
                        >
                          <Grid item className={classes.avatarSection}>
                            <Avatar
                              variant="rounded"
                              className={classes.avatar}
                              alt={e.user.name}
                              src={e.user.avatar as string}
                            />
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                              style={{ marginLeft: "7px" }}
                            >
                              {e.user.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CloseIcon onClick={() => handleDelete(e.id)} />
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  )}
                </Box>
              </ListItemText>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disableGutters style={{ paddingLeft: "15px", marginTop: "18px", paddingTop: "0px" }}>
          <ListItemText>
            <Typography className={classes.itemTitle}>
              <Text translation="document.revision.selected.groups" />
            </Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            {open1 ? (
              <ExpandLess onClick={handleClick1} />
            ) : (
              <ExpandMore onClick={handleClick1} />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open1} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItem disableGutters style={{ padding: "0px 15px 0px 15px" }}>
              <ListItemText>
                <Box>
                  <Box width={203} height={40}>
                    <Select
                      options={groupSelectOptions}
                      placeholder={intl.formatMessage({
                        id: "document.revision.search.groups",
                      })}
                      components={{ DropdownIndicator }}
                      onChange={(e) => saveValue(e)}
                      value={
                        accessElement.value === "" || !isGroup
                          ? null
                          : accessElement
                      }
                    />
                  </Box>
                  {!isEmpty(securityGroups) && securityGroups.map((e: Group, index) => (
                    <Grid
                      key={index}
                      justify="space-between"
                      alignItems="center"
                      container
                      style={{ paddingTop: "15px" }}
                    >
                      <Grid item className={classes.avatarSection}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {e.name}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <CloseIcon onClick={() => handleDelete(e.id)} />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
                {isVisible && (
                  <>
                    <Typography variant={TypographySize.md}>
                      <Text message={label || "common.operators"} />
                    </Typography>
                    <Box>
                      <Box width={203} height={40}>
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
                      </Box>
                      {!isEmpty(operators) && operators.map((e: Owner, index) => (
                        <Grid
                          key={index}
                          justify="space-between"
                          alignItems="center"
                          container
                          style={{ paddingTop: "15px" }}
                        >
                          <Grid item className={classes.avatarSection}>
                            <Avatar
                              variant="rounded"
                              className={classes.avatar}
                              alt={e.user.name}
                              src={e.user.avatar as string}
                            />
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                              style={{ marginLeft: "7px" }}
                            >
                              {e.user.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CloseIcon onClick={() => handleDeleteOperatorAccess(e.id)} />
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  </>
                )}
              </ListItemText>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default AccessPermissionsPresenter;
