import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { translate } from '../../../../common/intl';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { IconButton } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import useStyles from '../styles';
import { EditableRole } from '../types';

interface Props extends CellTemplateProps<EditableRole> {
  onConfirm: () => void
  onDiscard: () => void
}

const ActionsCell: React.FC<Props> = ({ dataItem, onConfirm, onDiscard }) => {
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && isEditMode) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isEditMode]);

  if (!isEditMode) {
    return null;
  }

  return (
    <div
      className={classes.actions}
      id="row-actions"
      ref={ref}
    >
      <Tooltip
        title={translate('common.discard')}
        placement="top"
        arrow
      >
        <IconButton
          data-cy="action-discard"
          kind="action"
          size="small"
          onClick={onDiscard}
        >
          <FontAwesomeIcon icon={regular('xmark')} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={translate('common.save')}
        placement="top"
        arrow
      >
        <IconButton
          data-cy="action-save"
          kind="action"
          size="small"
          onClick={onConfirm}
        >
          <FontAwesomeIcon icon={regular('check')} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ActionsCell;
