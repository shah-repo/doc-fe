import React from 'react';
import { TextField } from '../../../components/forms/fields-next';
import { SerialNumber } from '../types';

interface Props {
  dataItem: SerialNumber
  onChange: (id: string, notes: string | null) => void
}

const StatusCell: React.FC<Props> = ({ dataItem, onChange }) => {
  const [value, setValue] = React.useState(dataItem.notes ?? '');

  React.useEffect(() => {
    setValue(dataItem.notes ?? '');
  }, [dataItem.notes]);

  const saveValue = () => {
    if (value && value !== dataItem.notes) {
      onChange(dataItem.id, value);
    }
  };

  return (
    <TextField
      value={dataItem.notes}
      size="small"
      onChange={(e) => setValue(e.target.value)}
      onBlur={saveValue}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          saveValue();
        }
        if (e.key === 'Escape') {
          setValue(dataItem.notes ?? '');
        }
      }}
    />
  );
};

export default StatusCell;
