import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { cloneDeep } from 'lodash';
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
import { FBApprovalMatrixItem } from '../../../FBApprovalMatrixField/FBApprovalMatrixField.types';
import { withThemeNext } from '../../../../layout/theme-next';
import ClearIcon from '@material-ui/icons/ClearRounded';
import DoneIcon from '@material-ui/icons/DoneRounded';

// @todo: styles
// @todo: connect BE side
// @todo: approval roles

// @todo: translations
// @todo: refactoring
// @todo: optimisations
// @todo: filterTemplate
// @todo: fullscreen

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
  const [prevDataItem, setPrevDataItem] = useState<FBApprovalMatrixItem>();

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

  const handleAdd: React.MouseEventHandler = () => {
    const newItem = {
      docType: {
        active: true,
      },
      [MODE_FIELD]: Mode.add,
    };

    setData((data) => [...data, newItem as any]);
  };

  const handleRowClick = ({ dataItem: clickedDataItem }: GridRowClickEvent) => {
    setPrevDataItem(cloneDeep(clickedDataItem));

    setData((data) => data.map((dataItem) => {
      if (dataItem.id !== clickedDataItem.id) {
        return dataItem;
      }

      dataItem[MODE_FIELD] = Mode.edit;

      return dataItem;
    }));
  };

  const handleItemChange = ({ dataItem: changedDataItem }: GridItemChangeEvent) => {
    setData((data) => data.map((dataItem) => {
      if (dataItem.id !== changedDataItem.id) {
        return dataItem;
      }

      return changedDataItem;
    }));
  };

  const handleItemSave: React.MouseEventHandler = () => {
    // @todo: save request.

    setData((data) => data.map((dataItem) => {
      if (dataItem.id !== prevDataItem?.id) {
        return dataItem;
      }

      dataItem[MODE_FIELD] = Mode.show;

      return dataItem;
    }));

    setPrevDataItem(undefined);
  };

  const handleItemDiscard: React.MouseEventHandler = () => {
    setData((data) => data
      .filter((dataItem) => dataItem[MODE_FIELD] !== Mode.add)
      .map((dataItem) => {
        if (!prevDataItem || dataItem.id !== prevDataItem.id) {
          return dataItem;
        }

        prevDataItem[MODE_FIELD] = Mode.show;

        return prevDataItem;
      }),
    );

    setPrevDataItem(undefined);
  };

  const rowRender = (row: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
    const { dataItem } = props;

    const isUpdating = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const styledRow = React.cloneElement(row, {
      ...row.props,
      className: cx(row.props.className, classes.updating),
    });

    // @todo: fix actions position
    return (
      <>
        {styledRow}
        <div className={classes.actions}>
          <Button
            className={classes.actionButton}
            variant="outlined"
            onClick={handleItemDiscard}
          >
            <ClearIcon className={classes.iconButton} />
          </Button>
          <Button
            className={classes.actionButton}
            variant="outlined"
            onClick={handleItemSave}
          >
            <DoneIcon className={classes.iconButton} />
          </Button>
        </div>
      </>
    );
  };

  const schema = createSchema(approvalMatrix, approvalRoles);
  const isModifying = data.some(
    (dataItem) => [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]),
  );

  // @todo: Update rowspan without hack.
  useEffect(() => {
    document.querySelectorAll('.k-grid-header-wrap tr[aria-rowindex="2"] th').forEach((element) => {
      element.setAttribute('rowspan', '2');
    });
  }, []);

  return (
    <>
      <KendoDataGrid
        className={classes.grid}
        data={data}
        schema={schema}
        rowRender={rowRender}
        onRowClick={!isModifying ? handleRowClick : undefined}
        onItemChange={handleItemChange}
        onDataStateChange={handleDataStateChange}
        filterable={true}
        fullWidth={true}
        hasBoxScrollbars={true}
      />
      <Button
        className={classes.buttonAdd}
        variant="outlined"
        color="secondary"
        onClick={!isModifying ? handleAdd : undefined}
      >
        Add item
      </Button>
    </>
  );
};

export default withThemeNext(Grid);
