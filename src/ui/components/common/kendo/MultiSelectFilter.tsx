import { MultiSelect, MultiSelectChangeEvent, MultiSelectProps } from '@progress/kendo-react-dropdowns';
import * as React from 'react';
import { translate } from '../../../../common/intl';

interface Props<T = string> {
  data: T[]
  value: T[]
  placeholder?: string
  dataItemKey?: string
  textField?: string
  autoClose?: boolean
  onChange: (event: MultiSelectChangeEvent) => void
  itemRender?: MultiSelectProps['itemRender']
  tagRender?: MultiSelectProps['tagRender']
}

const CommonMultiSelect = <T extends unknown>({
  data,
  value,
  onChange,
  autoClose = false,
  placeholder = translate('common.select.value'),
  itemRender,
  tagRender,
  dataItemKey,
  textField,
}: Props<T>) => (
  <div className="status-multi-filter">
    <MultiSelect
      data={data}
      value={value}
      onChange={onChange}
      autoClose={autoClose}
      placeholder={placeholder}
      dataItemKey={dataItemKey}
      textField={textField}
      itemRender={itemRender}
      tagRender={tagRender}
    />
  </div>
);

export default React.memo(CommonMultiSelect);
