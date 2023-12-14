import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import React, { memo } from 'react';
import { translate } from '../../../../../../common/intl';
import { IconButton } from '../../../../../components/forms/fields-next';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import useHover from '../../../../../hooks/useHover';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const LotAllocatedCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, onExpandChange, expanded, ariaColumnIndex, colIndex, className }) => {
  const isEditMode = isEditAllocItem(dataItem) && !dataItem.isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const navigationAttributes = useTableKeyboardNavigation(id);
  const [removeLotRef, isRemoveLotHovered] = useHover<HTMLButtonElement>();
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={expanded}
      aria-selected="false"
      {...{ colSpan, id, style }}
      data-cy="cell-lot-allocated"
    >
      {hasChildren
        ? <>
          <span
            className={cx(
              classes.defaultIcon,
            )}
          >
            <StyleTooltip
              title={translate('common.add')}
              placement="top"
              arrow
            >
              <IconButton
                kind="simple"
                size="small"
                ref={addLotRef}
                data-cy="add-lot-button"
              >
                <FontAwesomeIcon
                  size="sm"
                  className={classes.addChildLotIcon}
                  icon={
                    !isAddLotHovered
                      ? regular('circle-plus')
                      : solid('circle-plus')
                  }
                />
              </IconButton>
            </StyleTooltip>
          </span>
        </>

        : <span className={cx(classes.nameCell, classes.titleInfoCell)}>
          {isEditMode && <div>-</div>}
          {!isEditMode && (<div className={classes.lotInfoWrapper}> <span className={classes.lotInfoId}>{dataItem.lotAllocated}</span>
            <span
              className={cx(
                classes.defaultIcon,
              )}
            >
              <StyleTooltip
                title={translate('relatedParts.created.modal.quick.view')}
                placement="top"
                arrow
              >
                <IconButton
                  kind="simple"
                  size="small"
                  ref={viewLotRef}
                  data-cy="view-lot-button"
                >
                  <FontAwesomeIcon
                    size="sm"
                    className={classes.viewIcon}
                    icon={
                      !isViewLotHovered
                        ? light('eye')
                        : solid('eye')
                    }
                  />
                </IconButton>
              </StyleTooltip>
              <StyleTooltip
                title={translate('common.delete')}
                placement="top"
                arrow
              >
                <IconButton
                  kind="simple"
                  size="small"
                  ref={removeLotRef}
                  data-cy="remove-lot-button"
                >
                  <FontAwesomeIcon
                    size="sm"
                    className={classes.deleteIcon}
                    icon={
                      !isRemoveLotHovered
                        ? regular('trash-can')
                        : solid('trash-can')
                    }
                  />
                </IconButton>
              </StyleTooltip>
            </span>
          </div>)
          }
        </span>
      }
    </td>
  );
};

export default memo(LotAllocatedCell);
