import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { Checkbox, FormikField } from '../../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import useStyles from '../../../../components/SettingsTable/styles';
import { EditableCompanyLocation } from '../../../CompanyLocations/types';

// const Editor: React.FC<CellTemplateProps<LCP>> = ({
//   dataItem,
//   dataIndex,
//   field,
//   onChange,
// }) => {
//   const { getFieldProps, setFieldValue } = useFormikContext();

//   const handleChange = (e, value: string) => {
//     setFieldValue(field, value);
//     onChange?.({
//       dataIndex,
//       dataItem,
//       syntheticEvent: e.syntheticEvent,
//       field,
//       value,
//     });
//   };

//   return (
//     <FormikField name={field}>
//       <Autocomplete
//         {...getFieldProps(field)}
//         blurOnSelect
//         disableClearable
//         placeholder={translate('common.select')}
//         options={dataItem.enlilTypeOptions}
//         data-cy={`${kebabCase(field)}-field`}
//         onChange={handleChange}
//         size="small"
//       />
//     </FormikField>
//   );
// };

export const IncludedInTotalQtyCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, getFieldMeta } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const classes = useStyles();

  const displayValue = translate(dataItem.includedInTotalQty ? 'common.true' : 'common.false');

  return (
    <Box display="flex" justifyContent="center">
      {isEditMode && (
        <FormikField
          name={field}
          className={classes.activeCheckbox}
        >
          <Checkbox
            checked={Boolean(getFieldMeta(field).value)}
            {...getFieldProps(field)}
          />
        </FormikField>
      )}
      {!isEditMode && (
        <div onClick={() => onClick?.({ dataItem })}>
          {displayValue}
        </div>
      )}
    </Box>
  );
};
