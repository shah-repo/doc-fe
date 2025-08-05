import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../components/OverflowContent';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

const PlannedIdCellTemplate: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, onExpandChange, level, hasChildren, materialSelectOptions, expanded } = props;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && !dataItem.lotId;
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue, errors } = useFormikContext<EditableMaterial>();

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  useEffect(() => {
    const value = materialSelectOptions?.find((option) => option.value === dataItem.plannedId);
    if (value && field) {
      setValue(value);
    }
  }, [materialSelectOptions, field, dataItem]);

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue(field, option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const displayValue = value.label ?? dataItem?.[field ?? ''];

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && (
        <span className={cx(classes.nameCell, classes.titleInfoCell)}>
          <div className={classes.idCellEditWrapper}>
            <FormikField name={field ?? ''} required error={Boolean(errors[field ?? ''])}>
              <Autocomplete
                {...getFieldProps(field)}
                value={value}
                blurOnSelect
                ListboxComponent={({ children, ...otherProps }) => {
                  return (
                    <>
                      <ul {...otherProps}>{children}</ul>
                    </>
                  );
                }}
                options={materialSelectOptions}
                placeholder={translate('common.select')}
                getOptionLabel={(option: OptionType) => option.label}
                onChange={handleChange}
                size="small"
              />
            </FormikField>
          </div>
        </span>
      )}
      {!isEditMode && (
        <OverflowContent title={displayValue}>
          <>
            {hasChildren && !isEditMode && (
              <span
                className={cx(
                  classes.defaultIcon,
                  classes.expandCell,
                  { [classes.expand]: hasChildren },
                  { [classes.disabled]: !hasChildren },
                )}
              >
                <FontAwesomeIcon
                  data-cy="minimize-row-button"
                  onClick={hasChildren ? onClick : undefined}
                  size="sm"
                  icon={expanded || !hasChildren ? regular('square-minus') : solid('square-plus')}
                />
              </span>
            )}
            {displayValue}
          </>
        </OverflowContent>
      )}
    </TreeListCellWrapper>
  );
};

export default memo(PlannedIdCellTemplate);
