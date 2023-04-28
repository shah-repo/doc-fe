import React, { useState } from 'react';
import {
  GridRowProps,
  GridRowClickEvent,
  GridItemChangeEvent,
  GridDataStateChangeEvent,
} from '@progress/kendo-react-grid';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { GridProps } from './types';
import { State } from '@progress/kendo-data-query';
import cx from 'classnames';
import useStyles from './styles';
import createSchema from './schema';

// @todo: add new
// @todo: change and save
// @todo: connect BE side
// @todo: translations
// @todo: styles
// @todo: sticky header
// @todo: refactoring
// @todo: generic component
// @todo: fullscreen
// @todo: context for schema

export const MODE_FIELD = '_mode';
export enum Mode {
  show = 'show',
  add = 'add',
  edit = 'edit',
}

const Grid: React.FC<GridProps> = (props) => {
  const { data: { approvalMatrix = [], approvalRoles = [] } = {} } = props;
  const classes = useStyles();

  const [data, setData] = useState(approvalMatrix);

  const handleAdd: React.MouseEventHandler = () => {
    setData((data) => [...data, { [MODE_FIELD]: Mode.add } as any]);
  };

  const handleRowClick = ({ dataItem }: GridRowClickEvent) => {
    setData((data) => data.map((item) => {
      const isAdd = item[MODE_FIELD] === Mode.add;

      if (item.id !== dataItem.id) {
        return {
          ...item,
          [MODE_FIELD]: !isAdd ? Mode.show : item[MODE_FIELD],
        };
      }

      return ({
        ...item,
        [MODE_FIELD]: !isAdd ? Mode.edit : item[MODE_FIELD],
      });
    }));
  };

  const handleItemChange = ({ dataItem }: GridItemChangeEvent) => {
    setData((data) => data.map((item) => {
      if (item.id !== dataItem.id) {
        return item;
      }

      return dataItem;
    }));
  };

  const handleDataStateChange = ({ dataState }: GridDataStateChangeEvent): State => {
    // Remove empty filters.
    if (dataState.filter?.filters) {
      dataState.filter.filters = dataState.filter.filters
        .filter((item) => {
          if ('value' in item) {
            return item.value !== '';
          }

          return true;
        });
    }

    return dataState;
  };

  const rowRender = (row: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
    const { dataItem } = props;

    const isUpdating = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const styledRow = React.cloneElement(
      row,
      {
        ...row.props,
        className: cx(row.props.className, classes.updating),
      },
      row.props.children,
    );

    return (
      <>
        {styledRow}
        <div className={classes.save}>Save</div>
        <div className={classes.discard}>Discard</div>
      </>
    );
  };

  const schema = createSchema(approvalMatrix, approvalRoles);

  return (
    <>
      <div onClick={handleAdd}>Button</div>
      <KendoDataGrid
        data={data}
        schema={schema}
        rowRender={rowRender}
        onRowClick={handleRowClick}
        onItemChange={handleItemChange}
        onDataStateChange={handleDataStateChange}
        filterable={true}
      />
    </>
  );
};

export default Grid;
