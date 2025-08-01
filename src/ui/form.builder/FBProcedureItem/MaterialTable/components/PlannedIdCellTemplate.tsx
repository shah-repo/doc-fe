import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../components/OverflowContent';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';

const PlannedIdCellTemplate: React.ComponentType<CustomTreeListCellProps> = ({
  hasChildren,
  colSpan,
  id,
  style,
  dataItem,
  materialSelectOptions,
  field,
  level,
  onExpandChange,
  expanded,
  ariaColumnIndex,
  colIndex,
  className,
}) => {
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue, errors } = useFormikContext<EditableMaterial>();

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  // useEffect(() => {
  //   // if (!isEditMode) {
  //   //   return;
  //   // }

  //   const value = partOptionsData?.find((option) => option.value === dataItem.plannedId);

  //   // if (value && field) {
  //   //   setFieldValue(field, value);
  //   //   setValue(value);
  //   // }
  // }, [partOptionsData, field, dataItem]);

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    console.log('option', option);
    setValue(option as OptionType);
    setFieldValue('partRevId', option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const displayValue = value.label ?? dataItem?.[field ?? ''];

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      role="gridcell"
      aria-expanded={expanded}
      aria-selected="false"
      onClick={handleClick}
      {...{ colSpan, id, style }}
      data-cy={`${field}-cell`}
    >
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
    </td>
  );
};

export default memo(PlannedIdCellTemplate);
