import React from 'react';
import { TextField } from '../../../components/forms/fields-next';
import { SerialNumber } from '../../FBSerials/types';

interface Props {
  dataItem: SerialNumber
  onChange: (id: string, notes: string | null) => void
}

const StatusCell: React.FC<Props> = ({ dataItem, onChange }) => {
  const [value, setValue] = React.useState(dataItem.notes ?? '');

  const defaultNotes = dataItem.notes ?? '';

  React.useEffect(() => {
    setValue(defaultNotes);
  }, [defaultNotes]);

  const saveValue = () => {
    if (value !== defaultNotes) {
      onChange(dataItem.id, value);
    }
  };

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onBlur={saveValue}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'Enter':
            e.currentTarget.blur();
            break;
          case 'Escape':
            setValue(dataItem.notes ?? '');
            e.currentTarget.blur();
            break;
        }
      }}
    />
  );
};

export default StatusCell;
