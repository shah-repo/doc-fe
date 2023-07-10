import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import React, { ComponentType } from 'react';
import { ReactComponent as CollapseIcon } from '../../../../../../assets/images/collapse_tree.svg';
import { ReactComponent as ExpandIcon } from '../../../../../../assets/images/expand_tree.svg';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const NameCell: ComponentType<CustomTreeListCellProps> = ({ hasChildren, ...props }) => {
  const classes = styles({ hasChildren });
  const navigationAttributes = useTableKeyboardNavigation(props.id);
  const onClick = (ev) => {
    props.onExpandChange(ev, props.dataItem, props.level);
  };
  const { colSpan, id, style } = props;

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, props.className)}
      aria-colindex={props.ariaColumnIndex}
      data-grid-col-index={props.colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={props.expanded}
      aria-selected="false"
      {...{ colSpan, id, style }}
    >
      {[...(Array(props.level.length - 1) as number[])].map((e, i) => (
        <span className="k-icon k-i-none" role="presentation" />
      ))}

      <span className="k-icon">
        {hasChildren && (props.expanded
          ? <CollapseIcon
            onClick={onClick}
            data-prevent-selection="true"
            role="presentation"
          />
          : <ExpandIcon
            onClick={onClick}
            data-prevent-selection="true"
            role="presentation"
          />)
        }
      </span>

      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {props.dataItem.docId}
      </span>
    </td>
  );
};

export default NameCell;
