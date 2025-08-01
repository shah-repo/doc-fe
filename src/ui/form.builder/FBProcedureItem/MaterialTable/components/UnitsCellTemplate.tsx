import cx from 'classnames';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent, memo } from 'react';
import OverflowContent from '../../../../components/OverflowContent';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { CELL_EMPTY_VALUE } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import { isEditMaterial } from './utils';

const Editor: React.FC<{field: string, units?: string[]}> = ({ field = '', units }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableMaterial>();

  const handleChange = (event: ChangeEvent<unknown>, value?: string) => {
    setFieldValue(field, value);
  };

  const value = values[field] as string;
  console.log('units editor', units);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        options={units}
        onChange={handleChange}
        value={value}
        size="small"
        disabled={isEmpty(values)}
      />
    </FormikField>
  );
};

const UnitsCellTemplate: React.ComponentType<CustomTreeListCellProps> = ({ dataItem, field = '', colSpan, style, className, hasChildren, units, unitOptions, onClick, ariaColumnIndex, colIndex, expanded }) => {
  const isEditMode = isEditMaterial(dataItem);
  const classes = styles({ hasChildren });

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, CELL_EMPTY_VALUE) as string;
  console.log('units top', units, unitOptions, ariaColumnIndex, colIndex, expanded);

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx('k-table-td', className, classes.cellborderBottom)}
      {...{
        'aria-colindex': ariaColumnIndex,
        'data-grid-col-index': colIndex,
        'aria-expanded': expanded,
      }}
      data-cy={`${field}-cell`}
    >
      {isEditMode ? <Editor {...{ field, units }} /> : <OverflowContent onClick={handleClick}>{displayValue}</OverflowContent>}
    </td>
  );
};

export default memo(UnitsCellTemplate);
