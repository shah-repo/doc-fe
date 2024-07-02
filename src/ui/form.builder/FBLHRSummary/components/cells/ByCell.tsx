import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { find, isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { changeRequestsSelectors } from '../../../../../state/ducks/changeRequest';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { FB } from '../../../helpers';
import { LHR_SUMARY_FIELDS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

interface ByCellEditorProps {
  availableUsers: OptionType[]
  user?: OptionType
}

const Editor: React.FC<ByCellEditorProps> = (props) => {
  const { user, availableUsers } = props;
  const [selectedUser, setSelectedUser] = useState(user ?? '');

  const onInputChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
      setFieldValue(LHR_SUMARY_FIELDS.enteredBy, value);
    }
  };

  const { setFieldValue, getFieldProps }
    = useFormikContext<EditableLHRSummaryItem>();

  const handleChange = (event: React.ChangeEvent<{}>, value?: OptionType) => {
    if (!value?.value) {
      return;
    }
    setSelectedUser(value);
    setFieldValue(LHR_SUMARY_FIELDS.enteredBy, value?.value);
  };

  return (
    <FormikField name={LHR_SUMARY_FIELDS.enteredBy}>
      <Autocomplete
        {...getFieldProps(LHR_SUMARY_FIELDS.lotOrEquipment)}
        key={isEmpty(availableUsers) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        freeSolo
        forcePopupIcon
        options={availableUsers}
        onInputChange={onInputChange}
        value={selectedUser}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        placeholder={translate('lhr.summary.placeholder.select.enter')}
        size="small"
      />
    </FormikField>
  );
};

export const ByCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  onClick,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const availableUsers = useSelector(changeRequestsSelectors.getUsersList);
  const enteredUser = dataItem[LHR_SUMARY_FIELDS.enteredBy] ?? '';
  const getUserDetails = (userId: string) => find(availableUsers, { value: userId });
  const user = FB.isUUID(enteredUser) ? getUserDetails(dataItem[LHR_SUMARY_FIELDS.enteredBy] ?? '') : { label: enteredUser, value: enteredUser };
  const label = user?.label;

  if (isEditMode) {
    return <Editor {...{ availableUsers, user }} />;
  }

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip title={label} placement="top" interactive arrow>
        {label}
      </OverflowTooltip>
    </Box>
  );
};
