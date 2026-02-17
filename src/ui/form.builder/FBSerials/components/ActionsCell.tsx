import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import { IconButton } from '../../../components/forms/fields-next';
import useHover from '../../../hooks/useHover';
import { SerialNumber } from '../types';

interface Props {
  dataItem: SerialNumber
  onDelete: (id: string) => void
}

const ActionsCell: React.FC<Props> = ({ dataItem, onDelete }) => {
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();

  return (
    <Tooltip title={translate('common.delete')}>
      <IconButton
        kind="destructive"
        ref={deleteRef}
        onClick={() => onDelete(dataItem.id)}
        data-cy="action-delete"
      >
        <FontAwesomeIcon icon={isDeleteHovered ? solid('trash-can') : regular('trash-can')} />
      </IconButton>
    </Tooltip>
  );
};

export default ActionsCell;
