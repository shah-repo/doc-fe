import { DropDownList } from '@progress/kendo-react-dropdowns';
import * as React from 'react';
import { translate } from '../../../../../../common/intl';
import unitsOptions from '../../../../FBData/unitsOptions.json';

const DropDownFilter = (props) => {
  const { field, onFilterChange } = props;
  const data = unitsOptions.map(item => ({ ...item, text: translate(item.text) }));

  const onChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      const filter = [...props.filter];
      const currentFilterIndex = filter.findIndex((f) => f.field === field);
      if (currentFilterIndex !== -1) {
        filter.splice(currentFilterIndex, 1);
      }
      filter.push({
        value: value.value,
        field,
        operator: 'contains',
      });
      onFilterChange({
        filter,
        field,
        syntheticEvent: event?.syntheticEvent,
      });
    },
    [props?.filter, field, onFilterChange],
  );

  return (
    <div className="k-filtercell">
      <DropDownList data={data} textField="text" dataItemKey="value" onChange={onChange} />
    </div>
  );
};
export default DropDownFilter;
