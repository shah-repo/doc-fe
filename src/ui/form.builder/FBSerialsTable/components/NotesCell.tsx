import cx from 'classnames';
import React, { useCallback } from 'react';
import { TextField } from '../../../components/forms/fields-next';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { useNotesCellStyles } from '../styles';
import { TableCellProps } from '../types';

interface Props extends TableCellProps {
  onChange: (id: string, notes: string | null) => void
}

const NotesCell: React.FC<Props> = ({
  isTableDisabled,
  dataItem,
  onChange,
}) => {
  const classes = useNotesCellStyles();
  const defaultNotes = dataItem.notes ?? '';
  const [value, setValue] = React.useState(defaultNotes);
  const [isEditing, setIsEditing] = React.useState(false);
  const isCancellingRef = React.useRef(false);

  React.useEffect(() => {
    setValue(defaultNotes);
  }, [defaultNotes]);

  const saveValue = useCallback((nextValue: string) => {
    if (nextValue !== defaultNotes) {
      onChange(dataItem.id, nextValue);
    }
    setIsEditing(false);
  }, [defaultNotes, onChange, dataItem.id]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;
      setValue(defaultNotes);
      setIsEditing(false);
      return;
    }

    saveValue(event.currentTarget.value);
  }, [defaultNotes, saveValue]);

  const handleDisplayClick = useCallback(() => {
    if (dataItem.isDisabled) {
      return;
    }

    setIsEditing(true);
  }, [dataItem.isDisabled]);

  if (isTableDisabled) {
    return <>{defaultNotes}</>;
  }

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
