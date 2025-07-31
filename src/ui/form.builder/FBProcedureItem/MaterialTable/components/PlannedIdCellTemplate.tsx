import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { useObserver } from 'mobx-react';
import React, { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../../components/OverflowContent';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { CustomTreeListCellProps, EditableMaterial, MaterialOption } from '../types';
import { styles } from './styles';

const PlannedIdCellTemplate: React.ComponentType<CustomTreeListCellProps> = ({
  hasChildren,
  colSpan,
  id,
  style,
  dataItem,
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

  const materialAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.materials,
  });

  const parts = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.materials) as Map<string, MaterialOption>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  const partOptionsData = useMemo(() => {
    return parts?.map((part) => ({
      label: translate('wo.displayRevision', {
        docId: part.document.docId,
        displayRevision: part?.displayRevision,
        name: part?.name,
      }),
      value: part.id,
    }));
  }, [parts]);

  useEffect(() => {
    materialAsync.load();
  }, [materialAsync]);

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  // useEffect(() => {
  //   // if (!isEditMode) {
  //   //   return;
  //   // }

  //   const value = partOptionsData?.find((option) => option.value === dataItem.plannedId);

  //   console.log('useeffect value', field, value, dataItem);

  //   // if (value && field) {
  //   //   setFieldValue(field, value);
  //   //   setValue(value);
  //   // }
  // }, [partOptionsData, field, dataItem]);

  console.log('parts', partOptionsData?.length);

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    console.log('option', option);
    setValue(option as OptionType);
    setFieldValue('partRevId', option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });

  console.log('Final ', value.label ?? dataItem?.[field ?? '']);
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
                options={partOptionsData}
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
