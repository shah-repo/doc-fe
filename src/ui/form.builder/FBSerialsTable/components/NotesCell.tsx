import cx from 'classnames';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { TextField } from '../../../components/forms/fields-next';
import { EditableSerialNumber } from '../../FBSerials/types';
import { useNotesCellStyles } from '../styles';

interface Props {
  dataItem: EditableSerialNumber
  onChange: (id: string, notes: string | null) => void
}

const NotesCell: React.FC<Props> = ({ dataItem, onChange }) => {
  const classes = useNotesCellStyles();
  const defaultNotes = dataItem.notes ?? '';
  const [value, setValue] = React.useState(defaultNotes);
  const [isEditing, setIsEditing] = React.useState(false);
  const isCancellingRef = React.useRef(false);

  React.useEffect(() => {
    setValue(defaultNotes);
  }, [defaultNotes]);

  const saveValue = (nextValue: string) => {
    if (nextValue !== defaultNotes) {
      onChange(dataItem.id, nextValue);
    }
    setIsEditing(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;
      setValue(defaultNotes);
      setIsEditing(false);
      return;
    }

    saveValue(event.currentTarget.value);
  };

  const handleDisplayClick = () => {
    if (dataItem.isDisabled) {
      return;
    }

    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <TextField
        autoFocus
        size="small"
        value={value}
        disabled={dataItem.isDisabled}
        classes={{ root: classes.inputRoot }}
        onChange={(e) => setValue(e.currentTarget.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'Enter':
              e.currentTarget.blur();
              break;
            case 'Escape':
              isCancellingRef.current = true;
              e.currentTarget.blur();
              break;
          }
        }}
      />
    );
  }

  return (
    <div
      className={cx(classes.displayValue, {
        [classes.disabledDisplayValue]: dataItem.isDisabled,
      })}
      onClick={handleDisplayClick}
    >
      <OverflowTooltip
        title={value}
        placement="top"
        arrow
      >
        {value}
      </OverflowTooltip>
    </div>
  );
};

export default NotesCell;
