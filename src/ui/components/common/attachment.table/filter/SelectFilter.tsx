// import Filter from '../Filter';
// import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { Checkbox } from '@progress/kendo-react-inputs';
// import { debounce } from 'lodash';
import React from 'react';
// import Filter from '../../../../form.builder/FBApprovalMatrix/components/Filter';

const SelectFilter: React.FC<any> = (props) => {
  const {
    headerChecked,
    handleHeaderCheckedChange,
    // operator = 'contains',
    // onChange,
  } = props;

  // const [checked, setChecked] = React.useState(false);
//   const handleChange = debounce(
//     (event: CheckboxChangeEvent) => {
//       const newValue = event.target.value;
// console.log('-----new value--', { newValue, value });
//       if (newValue === value) {
//         return;
//       }

//       onChange({
//         value: newValue,
//         operator,
//         syntheticEvent: event.syntheticEvent,
//       });
//     },
//     500,
//   );
// const handleChange = (event: CheckboxChangeEvent) => {
//   console.log('---value---', { value }, event.target.value);
//   setChecked(Boolean(event.target.value));
// };

  return (
    // <Filter {...props}>
      <Checkbox
        checked={headerChecked}
        onChange={handleHeaderCheckedChange}
      />
    // </Filter>
  );
};

export default SelectFilter;
