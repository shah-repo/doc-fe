import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { ChangeEvent, memo, useEffect } from 'react';
import OverflowContent from '../../../../components/OverflowContent';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { CELL_EMPTY_VALUE } from '../constants';
import { CustomTreeListCellProps, EditableMaterial, UnitOption } from '../types';
import TreeListCellWrapper from './TreeListCellWrapper';
import { isEditMaterial } from './utils';

const Editor: React.FC<CustomTreeListCellProps> = ({ field = '', isLHRT }) => {
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableMaterial>();

  const handleChange = (_: ChangeEvent<unknown>, value?: string) => {
    setFieldValue(field, value);
  };

  const unitsAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.unitMeasures,
  });

  useEffect(() => {
    unitsAsync.load();
  }, [unitsAsync]);

  const units = useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
    string,
    UnitOption
    >;
    return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
  });

  const value = values[field] as string;
  const shouldDisable = !isLHRT && isEmpty(units) && values.LHRTparameter;

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(units) ? 'disabled' : 'enabled'}
        blurOnSelect
        options={units}
        onChange={handleChange}
        value={value}
        size="small"
        disabled={shouldDisable}
      />
    </FormikField>
  );
};

const UnitsCellTemplate: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem } = props;
  const isEditMode = isEditMaterial(dataItem);
  const displayValue = get(dataItem, field, CELL_EMPTY_VALUE) as string;

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode ? <Editor {...props} /> : <OverflowContent>{displayValue}</OverflowContent>}
    </TreeListCellWrapper>
  );
};

export default memo(UnitsCellTemplate);
