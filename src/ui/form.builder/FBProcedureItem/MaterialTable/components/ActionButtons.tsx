import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { translate } from '../../../../../common/intl';
import { IconButton } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import useHover from '../../../../hooks/useHover';
import { ActionsProps, EditableMaterial } from '../types';
import { styles } from './styles';

export default function ActionButtons (props: ActionsProps<EditableMaterial>): React.ReactElement | null {
  const {
    dataItem,
    scrollBehavior = 'auto',
    isDeleteDisabled,
    isAddPartEnabled,
    onConfirm,
    onDiscard,
    onDelete,
    onChildPartAdd,
  } = props;
  const classes = styles();
  const [deleteRef, isHovered] = useHover<HTMLButtonElement>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' }));
    }
  }, [scrollBehavior]);
  const isPartEdit = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

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
              data-cy="action-add-child-part"
              onClick={() => onChildPartAdd(dataItem)}
            >
              <FontAwesomeIcon icon={solid('plus')} />
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
              data-cy="action-delete"
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
