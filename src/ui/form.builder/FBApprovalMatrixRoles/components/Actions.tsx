import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { translate } from '../../../../common/intl';
import { IconButton } from '../../../components/forms/fields-next';
import useHover from '../../../hooks/useHover';
import { MODE_FIELD, Mode } from '../constants';
import useStyles from '../styles';

interface EditableItem {
  [MODE_FIELD]: Mode
}

export interface ActionsProps {
  dataItem: EditableItem
  isDeleteDisabled?: boolean
  isSubmitDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
}

const Actions: React.FC<ActionsProps> = ({
  dataItem,
  scrollBehavior = 'auto',
  isDeleteDisabled,
  isSubmitDisabled,
  deleteTooltipText,
  onConfirm,
  onDiscard,
  onDelete,
}) => {
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [deleteRef, isHovered] = useHover<HTMLButtonElement>();
  const saveTooltipContent = !isSubmitDisabled ? 'common.save' : 'approvalRequest.tasks.list.task.completed.tooltip';
  const deleteTooltipContent = !isDeleteDisabled ? 'common.delete' : 'approvalRequest.tasks.list.task.completed.tooltip';

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' }));
    }
  }, [scrollBehavior]);

  if (!isEditMode) {
    return null;
  }

  return (
    <div
      className={classes.actions}
      id="row-actions"
      ref={ref}
    >
      {onDelete && (
        <Tooltip
          title={deleteTooltipText ?? translate(deleteTooltipContent)}
          placement="top"
          arrow
        >
          <div>
            <IconButton
              data-cy="action-delete"
              kind="action"
              size="small"
              onClick={onDelete}
              ref={deleteRef}
              disabled={isDeleteDisabled}
            >
              <FontAwesomeIcon
                className={cx({ [classes.deleteIcon]: !isDeleteDisabled })}
                icon={isHovered ? solid('trash-can') : regular('trash-can')}
              />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {onDiscard && (
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
      )}
      {onConfirm && (
        <Tooltip
          title={translate(saveTooltipContent)}
          placement="top"
          arrow
        >
          <IconButton
            data-cy="action-save"
            kind="action"
            size="small"
            onClick={onConfirm}
            disabled={isSubmitDisabled}
          >
            <FontAwesomeIcon icon={regular('check')} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default Actions;
