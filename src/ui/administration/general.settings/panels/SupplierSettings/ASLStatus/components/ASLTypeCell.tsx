import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import useStyles from '../../../../components/SettingsTable/styles';
import { ASL_STATUS_KEYS, ASLStatus, CustomCellProps } from '../types';

const Editor: React.FC<CustomCellProps> = ({
  dataItem,
  dataIndex,
  field,
  dataOptions = [],
  onChange,
}) => {
  const classes = useStyles();
  const { getFieldProps, setFieldValue } = useFormikContext();
  const value = (dataOptions as ASLStatus[])?.find(
    (option: ASLStatus) => option.internalType === dataItem[field],
  );

  const handleChange = (event: ChangeEvent<unknown>, value: ASLStatus) => {
    setFieldValue(field, value.internalType);
    setFieldValue(ASL_STATUS_KEYS.order, value.order);
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event,
      field,
      value,
    });
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        disabled={Mode.edit === dataItem[MODE_FIELD]}
        blurOnSelect
        disableClearable
        getOptionLabel={(option: ASLStatus) => option.internalType}
        getOptionSelected={(option: ASLStatus, value) =>
          option.internalType === value
        }
        value={value}
        classes={{
          root: classes.inputRoot,
        }}
        placeholder={translate('common.select')}
        options={dataOptions}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const ASLTypeCell: React.FC<CustomCellProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = kebabCase(field);

  if ([Mode.add, Mode.edit].includes(dataItem[MODE_FIELD])) {
    return <Editor {...props} />;
  }

  return (
    <Box
      display="flex"
      justifyContent="start"
      data-cy={`${dataCy}-td`}
      onClick={handleClick}
    >
      <OverflowTooltip
        arrow
        placement="top"
        title={dataItem[field]}
        onClick={handleClick}
        data-cy={`${dataCy}-value`}
      >
        {dataItem[field]}
      </OverflowTooltip>
    </Box>
  );
};
