import React from 'react';
import { TextField } from '../../../components/forms/fields-next';
import { EditableSerialNumber } from '../../FBSerials/types';

interface Props {
  dataItem: EditableSerialNumber
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
      onChange(dataItem.id, value ?? null);
    }
  };

  return (
    <TextField
      size="small"
      value={value}
      disabled={dataItem.isDisabled}
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
