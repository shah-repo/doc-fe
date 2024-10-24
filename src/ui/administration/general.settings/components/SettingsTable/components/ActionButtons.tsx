import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { MutableRefObject } from 'react';
import { translate } from '../../../../../../common/intl';
import { IconButton } from '../../../../../components/forms/fields-next';
import useHover from '../../../../../hooks/useHover';
import useStyles from '../styles';

interface Props {
  isActive?: boolean
  isLoading?: boolean
  isEditMode?: boolean
  onEdit?: () => void
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
}

const ActionsButtons: React.FC<Props> = ({
  isActive,
  isLoading,
  isEditMode,
  onEdit,
  onDelete,
  onConfirm,
  onDiscard,
}, ref: MutableRefObject<HTMLDivElement>) => {
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDiscardHovered] = useHover<HTMLButtonElement>();

  const classes = useStyles();

  return (
    <div
      id="row-actions"
      ref={ref}
      className={cx(classes.actions, { [classes.actionsEdit]: isEditMode })}
    >
      {isEditMode ? (
        <>
          <Tooltip title={translate('common.discard')}>
            <IconButton
              kind="simple"
              color="primary"
              ref={discardRef}
              onClick={onDiscard}
              iconSize={22}
              data-cy="action-discard"
            >
              <FontAwesomeIcon icon={isDiscardHovered ? solid('square-xmark') : light('square-xmark')} />
            </IconButton>
          </Tooltip>
          <Tooltip title={translate('common.save')}>
            <IconButton
              kind="simple"
              color="primary"
              ref={saveRef}
              onClick={onConfirm}
              iconSize={22}
              disabled={isLoading}
              data-cy="action-save"
            >
              <FontAwesomeIcon icon={isSaveHovered ? solid('square-check') : light('square-check')} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip title={translate('common.edit')}>
            <IconButton
              kind="form"
              color="primary"
              onClick={onEdit}
              disabled={!isActive}
              data-cy="action-edit"
            >
              <FontAwesomeIcon icon={regular('pen-to-square')} />
            </IconButton>
          </Tooltip>
          {onDelete && (
            <Tooltip title={translate('common.delete')}>
              <IconButton
                kind="destructive"
                ref={deleteRef}
                onClick={onDelete}
                disabled={isLoading}
                data-cy="action-delete"
              >
                <FontAwesomeIcon icon={isDeleteHovered ? solid('trash-can') : regular('trash-can')} />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default React.forwardRef(ActionsButtons);
