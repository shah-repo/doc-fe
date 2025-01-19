import { Box, Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
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
import { ASL_STATUS_CLASS_MAPPING } from '../../../../../../form.builder/FBProductOrService/constants';
import useStyles from '../../../../components/SettingsTable/styles';
import { ASLStatus, ASLSTATUS_KEYS, CustomCellProps } from '../types';
import styles from './ASLTypeCell.styles';

const Editor: React.FC<CustomCellProps> = ({
  dataItem,
  dataIndex,
  field,
  dataOptions = [],
  onChange,
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const isEditMode = Mode.edit === dataItem[MODE_FIELD];
  const classes = useStyles();
  const value = (dataOptions as ASLStatus[])?.find(
    (option: ASLStatus) => option.internalType === dataItem[field],
  );

  const handleChange = (e, value: ASLStatus) => {
    setFieldValue(field, value.internalType);
    setFieldValue(ASLSTATUS_KEYS.order, value.order);
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: e.syntheticEvent,
      field,
      value,
    });
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        disabled={isEditMode}
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
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = kebabCase(field);
  const classes = styles();
  const displayValue = dataItem[field];

  return (
    <Box
      display="flex"
      justifyContent="start"
      data-cy={`${dataCy}-td`}
      onClick={handleClick}
    >
      {isEditMode && <Editor {...props} />}
      {!isEditMode && (
        <OverflowTooltip
          arrow
          placement="top"
          title={displayValue}
          onClick={handleClick}
          data-cy={`${dataCy}-value`}
        >
          <Chip
            size="small"
            className={cx(
              classes.chip,
              classes[ASL_STATUS_CLASS_MAPPING[displayValue]],
            )}
            label={displayValue}
          />
        </OverflowTooltip>
      )}
    </Box>
  );
};
