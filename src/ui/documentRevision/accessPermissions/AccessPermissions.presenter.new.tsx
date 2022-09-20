import { Avatar, Box, Collapse, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { filter, isEmpty, isEqual, some, truncate } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import Select, { components, OptionProps } from "react-select";
import { ReactComponent as CloseIcon } from "../../../assets/images/delete_icon.svg";
import { Group } from "../../../state/ducks/auth/types";
import { Owner, TypographySize } from "../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { getInitalsFromName } from "../../components/icons/avatar/helpers";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import Colors from "../../layout/theme/utils/colors";
import { StyledTooltip } from "../forms/presenters/AvailableReferences.new";
import { styles } from "./AccessPermissions.styles.new";

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

  const [usersOpen, setUsersOpen] = React.useState(true);
  const [groupsOpen, setGroupsOpen] = React.useState(true);

  const handleClick = () => {
    setUsersOpen(!usersOpen);
  };

  const handleGroupClick = () => {
    setGroupsOpen(!groupsOpen);
  };

  const truncateLabel = (label) => truncate(label, { length: 30, omission: " ..." });

  const Option = (props: OptionProps<OptionType>) => {
    const { data } = props;
    if (data?.label?.length > 30) {
      return (
        <components.Option {...props} >
          <StyledTooltip title={data.label}>
            <>{truncateLabel(data.label)}</>
          </StyledTooltip>
        </components.Option>
      );
    }
    return (<components.Option {...props} />);
  };

  return (
    <Box flexGrow={1}>
      <List disablePadding>
        <ListItem disableGutters className={classes.listItem}>
          <ListItemText>
            <Typography className={classes.itemTitle}>
              <Text translation="document.revision.selected.users" />
            </Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            {usersOpen ? (
              <ExpandLess onClick={handleClick} />
            ) : (
              <ExpandMore onClick={handleClick} />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={usersOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItem disableGutters className={classes.collapseListItem}>
              <ListItemText>
                <>
                  <Box width={203} height={40} fontFamily="Sora">
                    <Select
                      options={employeeSelectOptions}
                      menuPlacement={"auto"}
                      styles={{
                        option: (style) => ({ ...style, wordWrap: "break-word" }),
                      }}
                      onChange={(e) => saveValue(e)}
                      placeholder={intl.formatMessage({
                        id: "document.revision.search.users",
                      })}
                      components={{ DropdownIndicator, Option }}
                      value={
                        accessElement.value === "" || isGroup
                          ? null
                          : accessElement
                      }
                    />
                  </Box>
                  {!isEmpty(securityEmployees) && (
                    <>
                      {securityEmployees.map(({ id, user }: Owner, index) => (
                        <Grid
                          key={index}
                          justify="space-between"
                          alignItems="center"
                          container
                          className={classes.selectedUsersGrid}
                        >
                          <Grid item className={classes.avatarSection}>
                            <Avatar
                              variant="rounded"
                              className={classes.avatar}
                              alt={user.name}
                              src={user.avatar ? user.avatar : undefined}
                              style={user.avatar ? {} : { background: user.initialColor, color: Colors.white }}
                            >
                              {!user.avatar && getInitalsFromName(user.name)}
                            </Avatar>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                              data-cy="Selected-Users"
                              className={`${classes.userName} marginLeft7`}
                            >
                              {user.name}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.deleteIcon}>
                            <CloseIcon cursor="pointer" onClick={() => handleDelete(id)} />
                          </Grid>
                        </Grid>
                      ))}
                    </>
                  )}
                </>
              </ListItemText>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disableGutters className={classes.listItem}>
          <ListItemText>
            <Typography className={classes.itemTitle}>
              <Text translation="document.revision.selected.groups" />
            </Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            {groupsOpen ? (
              <ExpandLess onClick={handleGroupClick} />
            ) : (
              <ExpandMore onClick={handleGroupClick} />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={groupsOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItem disableGutters className={classes.collapseListItem}>
              <ListItemText>
                <>
                  <Box width={203} height={40} fontFamily="Sora">
                    <Select
                      options={groupSelectOptions}
                      menuPlacement={"auto"}
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
                      className={`${classes.selectedUsersGrid} groupsGrid`}
                      container
                    >
                      <Grid item className={classes.avatarSection}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                          data-cy="Selected-Groups"
                          className={classes.userName}
                        >
                          {e.name}
                        </Typography>
                      </Grid>
                      <Grid item className={classes.deleteIcon}>
                        <CloseIcon cursor="pointer" onClick={() => handleDelete(e.id)} />
                      </Grid>
                    </Grid>
                  ))}
                </>
                {isVisible && (
                  <>
                    <Typography variant={TypographySize.md} className={classes.itemTitle}>
                      <Text message={label || "common.operators"} />
                    </Typography>
                    <>
                      <Box width={203} height={40} fontFamily="Sora" pt={1.825}>
                        <Select
                          id="document.assing.to.sidebar"
                          menuPlacement={"top"}
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
                          className={classes.selectedUsersGrid}
                          alignItems="center"
                          container
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
                              className={classes.marginLeft7}
                            >
                              {e.user.name}
                            </Typography>
                          </Grid>
                          <Grid item className={classes.deleteIcon} data-cy={"operator-ac-" + e.user.name}>
                            <CloseIcon onClick={() => handleDeleteOperatorAccess(e.id)} />
                          </Grid>
                        </Grid>
                      ))}
                    </>
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
