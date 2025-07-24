import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';
import { ApplicationState } from '../../../../state/reducers';
import { store } from '../../../../state/store';
import { AvatarComponent } from '../../../components/common/kendo.column.templates/UserAvatar';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { FB } from '../../helpers';
import { UPLOADED_BY_NAME } from '../constants';
import { CustomTemplateProps, EditableCertification } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { workspaceState } = FB.useStores();
  const docRevOwner = workspaceState?.document?.owner.user;
  const isAddition = dataItem[MODE_FIELD] === Mode.add;
  const { id: currentUserId, name = '' } = (docRevOwner ?? store.getState().auth.user) ?? {};
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableCertification>();
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const defaultValue = { label: values.uploadedByName ?? '', value: values[field] ?? '' };

  if (isAddition && values && !values?.[field]) {
    setFieldValue(field, currentUserId);
    setFieldValue(UPLOADED_BY_NAME, name);
  }

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    if (!value?.value) { return; }
    setFieldValue(field, value?.value);
    setFieldValue(UPLOADED_BY_NAME, value?.label);
  };

  return (
    <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        options={availableUsers}
        onChange={handleChange}
        getOptionLabel={(option: OptionType) => option.label}
        value={defaultValue}
        size="small"
      />
    </FormikField>
  );
};

export const UploadedByCell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;

  const { workspaceState } = FB.useStores();
  const docRevOwner = workspaceState?.document?.owner.user;
  const { id: currentUserId } = docRevOwner ?? store.getState().auth.user;

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const selectedUserInfo = useSelector((state: ApplicationState) =>
    changeRequestsSelectors.getUserInfoById(state, dataItem[field] ?? currentUserId));

  if (isEditMode) {
    return <Editor {...props} />;
  }

  if (!selectedUserInfo) {
    return null;
  }

  const { name = '', avatar, initialColor } = selectedUserInfo;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <AvatarComponent {...{ name, avatar, initialColor }} />
    </Box>
  );
};
