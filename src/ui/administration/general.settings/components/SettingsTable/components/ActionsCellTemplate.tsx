import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { translate } from '../../../../../../common/intl';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { IconButton } from '../../../../../components/forms/fields-next';
import useHover from '../../../../../hooks/useHover';
import useStyles from '../styles';

interface Props<T extends EditableItem> extends CellTemplateProps<T> {
  scrollBehavior?: ScrollBehavior
  isActive?: boolean
  onEdit?: (item: T) => void
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: (item: T) => void
}

function ActionsCellTemplate<T extends EditableItem> ({
  dataItem,
  scrollBehavior = 'auto',
  isActive,
  onEdit,
  onDelete,
  onConfirm,
  onDiscard,
}: Props<T>): React.ReactElement {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();
  const [saveRef, isSaveHovered] = useHover<HTMLButtonElement>();
  const [discardRef, isDiscardHovered] = useHover<HTMLButtonElement>();

  const classes = useStyles();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'center' }));
    }
  }, [scrollBehavior]);

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
              onClick={() => onEdit?.(dataItem)}
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
                onClick={() => onDelete?.(dataItem)}
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
}

export default ActionsCellTemplate;
