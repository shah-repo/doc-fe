import { Avatar, Grid, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as CloseIcon } from '../../../../../../../assets/images/trash.svg';
import { changeRequestsSelectors } from '../../../../../../../state/ducks/changeRequest';
import { ApplicationState } from '../../../../../../../state/reducers';
import { Autocomplete, FormikField } from '../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import { getInitalsFromName } from '../../../../../../components/icons/avatar/helpers';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import Colors from '../../../../../../layout/theme/utils/colors';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps, EditableTLItem } from '../../interface';
import { styles } from './styles';

const renderUsers = (selectedUsers, removeUser?) => {
  const classes = styles();
  const approvers = useSelector((state: ApplicationState) => {
    return state.changeRequests.approversByIdMap;
  });
  const users = selectedUsers?.map(({ employeeId }) => approvers[employeeId]);
  return (
    <>
      {!isEmpty(users) && users.map(({ id, user }, index) => (
        <Grid
          key={index}
          justify="space-between"
          alignItems="center"
          className={`${classes.selectedUsersGrid} groupsGrid`}
          container
        >
          <Grid item className={classes.avatarSection}>
            <Avatar
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
              data-cy="Selected-Groups"
              className={classes.userName}
            >
              {user.name}
            </Typography>
          </Grid>
          {removeUser && <Grid item className={classes.deleteIcon}>
            <CloseIcon cursor="pointer" onClick={() => removeUser(id)} />
          </Grid>}
        </Grid>
      ))}
    </>
  );
};

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableTLItem>();
  const selectedUsers = values[field] ?? [];

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, [...selectedUsers, { employeeId: value?.value }]);
  };

  const removeUser = (id) => {
    setFieldValue(field, selectedUsers.filter(({ employeeId }) => employeeId !== id));
  };

  const availableApprovers = useSelector((state: ApplicationState) => {
    return changeRequestsSelectors.getApproversListForAssessmentForm(state);
  });

  return (
    <>
      <FormikField
        name={field}
      >
        <Autocomplete
          {...getFieldProps(field)}
          key={isEmpty(values) ? 'disabled' : 'enabled'}
          blurOnSelect
          options={availableApprovers}
          onChange={handleChange}
          getOptionLabel={(option: OptionType) => option.label}
          value={{ label: 'Add user' }}
          size="small"
        />
      </FormikField>
      {renderUsers(selectedUsers, removeUser)}
    </>
  );
};

export const AssignedTOCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const selectedUsers = get(dataItem, field, []);

  return (
    <OverflowingContent onClick={handleClick}>
      {renderUsers(selectedUsers)}
    </OverflowingContent>
  );
};
