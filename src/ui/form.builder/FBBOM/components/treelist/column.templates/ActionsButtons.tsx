import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { translate } from '../../../../../../common/intl';
import { IconButton } from '../../../../../components/forms/fields-next';
import useHover from '../../../../../hooks/useHover';
import { EditableBOM } from '../../../interface';
import { DELETE_FIELD, MODE_FIELD } from '../constants';
import { isAddOnly, isEditBOM } from '../utils';
import { styles } from './styles';
import { BOMActionsProps } from './types';

export default function ActionButtons (props: BOMActionsProps<EditableBOM>): React.ReactElement | null {
  const {
    dataItem,
    scrollBehavior = 'auto',
    isDeleteDisabled,
    isAddPartEnabled,
    onConfirm,
    onDiscard,
    onDelete,
    onRestore,
    onChildPartAdd,
  } = props;
  const classes = styles();
  const [deleteRef, isHovered] = useHover<HTMLButtonElement>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' }));
    }
  }, [scrollBehavior]);

  const isPartDeleted = dataItem[DELETE_FIELD];
  const isPartEdit = !isAddOnly(dataItem) && isEditBOM(dataItem);

  if (!dataItem[MODE_FIELD]) {
    return null;
  }

  return (
    <div
      className={classes.actions}
      id="row-actions"
      ref={ref}
    >
      {isAddPartEnabled && onChildPartAdd && (
        <Tooltip
          title={translate('bom.add.child.part')}
          placement="top"
          arrow
        >
          <div>
            <IconButton
              kind="action"
              size="small"
              onClick={() => onChildPartAdd(dataItem)}
            >
              <FontAwesomeIcon icon={solid('plus')} />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {isPartDeleted && onRestore && (
        <Tooltip
          title={translate('common.restore')}
          placement="top"
          arrow
        >
          <div>
            <IconButton
              kind="action"
              size="small"
              onClick={() => onRestore(dataItem)}
            >
              <FontAwesomeIcon
                className={cx({ [classes.deleteIcon]: !isDeleteDisabled })}
                icon={solid('arrow-rotate-left')} />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {isPartEdit && onDelete && (
        <Tooltip
          title={translate('common.delete')}
          placement="top"
          arrow
        >
          <div>
            <IconButton
              kind="action"
              size="small"
              onClick={() => onDelete(dataItem)}
              ref={deleteRef}
              disabled={isDeleteDisabled}
            >
              <FontAwesomeIcon
                className={cx({ [classes.deleteIcon]: !isDeleteDisabled })}
                icon={isHovered ? solid('trash-can') : regular('trash-can')} />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {onDiscard && <Tooltip
        title={translate('common.discard')}
        placement="top"
        arrow
      >
        <IconButton
          data-cy="action-discard"
          kind="action"
          size="small"
          onClick={() => onDiscard(dataItem)}
        >
          <FontAwesomeIcon icon={regular('xmark')} />
        </IconButton>
      </Tooltip>}
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
