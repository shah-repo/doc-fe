import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { CompanyLocation } from '../../../../../../state/ducks/company/types';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { LotTransferType } from '../../../../../form.builder/FBLotTransfers/types';
import useStyles from '../styles';
import { EditableMaterialFlowAclRule } from '../types';

const EMPTY_VALUE_PLACEHOLDER = '-';

interface Props extends CellTemplateProps<EditableMaterialFlowAclRule> {
  options: CompanyLocation[]
}

export const LocationCellTemplate: React.FC<Props> = ({ dataItem, field, options, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableMaterialFlowAclRule>();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: CompanyLocation) => {
    setFieldValue(field, value);
  };

  const value = (isEditMode ? values[field] : dataItem[field]) as CompanyLocation;

  const isScrapAction = values.action === LotTransferType.Scrap;
  const isDisabled = field === 'to' && isScrapAction;

  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          options={options.filter(loc => loc.active)}
          getOptionLabel={(option: CompanyLocation) => option.name}
          getOptionSelected={(option: CompanyLocation, value: CompanyLocation) => option.id === value.id}
          value={isDisabled ? null : value}
          onChange={handleChange}
          size="small"
          disabled={isDisabled}
          classes={{
            root: classes.inputRoot,
          }}
        />
      </FormikField>
    );
  }

  const displayValue = value ? value.name : EMPTY_VALUE_PLACEHOLDER;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip
        title={displayValue}
        placement="top"
        interactive
        arrow
      >
        {displayValue}
      </OverflowTooltip>
    </Box>
  );
};
