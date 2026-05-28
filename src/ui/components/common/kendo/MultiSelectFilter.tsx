import { MultiSelect, MultiSelectChangeEvent } from '@progress/kendo-react-dropdowns';
import * as React from 'react';
import { translate } from '../../../../common/intl';

interface Props<T = string> {
  data: T[]
  value: T[]
  placeholder?: string
  autoClose?: boolean
  onChange: (event: MultiSelectChangeEvent) => void
  itemRender?: (li: React.ReactElement, itemProps: any) => React.ReactElement
  tagRender?: (tagData: any, li: React.ReactElement) => React.ReactElement
}

const CommonMultiSelect = <T extends unknown>({
  data,
  value,
  onChange,
  autoClose = false,
  placeholder = translate('common.select.value'),
  itemRender,
  tagRender,
}: Props<T>) => (
  <div className="status-multi-filter">
    <MultiSelect
      data={data}
      value={value}
      onChange={onChange}
      autoClose={autoClose}
      placeholder={placeholder}
      itemRender={itemRender}
      tagRender={tagRender}
    />
  </div>
);

export default CommonMultiSelect;
