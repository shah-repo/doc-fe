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

export interface ActionsProps<T> {
  dataItem: T
  isDeleteDisabled?: boolean
  deleteTooltipText?: string
  scrollBehavior?: ScrollBehavior
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
}

export default function Actions <T> (props: ActionsProps<T>): React.ReactElement | null {
  const {
    dataItem,
    scrollBehavior = 'auto',
    isDeleteDisabled,
    deleteTooltipText,
    onConfirm,
    onDiscard,
    onDelete,
  } = props;
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [deleteRef, isHovered] = useHover<HTMLButtonElement>();

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
          title={deleteTooltipText ?? 'delete'}
          placement="top"
          arrow
        >
          <div>
            <IconButton
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
}
