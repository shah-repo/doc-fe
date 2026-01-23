import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { translate } from '../../../../../common/intl';
import { IconButton } from '../../../../components/forms/fields-next';
import useHover from '../../../../hooks/useHover';
import { MODE_FIELD } from '../constants';
import { EditableMaterial, MaterialCellActionsProps } from '../types';
import { styles } from './styles';
import { isAddMaterial, isEditMaterial } from './utils';

export default function ActionButtons (props: MaterialCellActionsProps<EditableMaterial>): React.ReactElement | null {
  const {
    dataItem,
    scrollBehavior = 'auto',
    isDeleteDisabled,
    onConfirm,
    onDiscard,
    onDelete,
  } = props;
  const classes = styles();
  const [deleteRef, isHovered] = useHover<HTMLButtonElement>();
  const { errors } = useFormikContext<EditableMaterial>();
  const isSubmitDisabled = !isEmpty(errors);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' }));
    }
  }, [scrollBehavior]);
  const isPartEdit = !isAddMaterial(dataItem) && isEditMaterial(dataItem);

  if (!dataItem[MODE_FIELD]) {
    return null;
  }

  return (
    <div
      className={classes.actions}
      id="row-actions"
      ref={ref}
    >
      {isPartEdit && onDelete && (
        <Tooltip
          title={translate('common.delete')}
          placement="top"
          arrow
        >
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
          disabled={isSubmitDisabled}
        >
          <FontAwesomeIcon icon={regular('check')} />
        </IconButton>
      </Tooltip>
    </div>
  );
}
