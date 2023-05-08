import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import {
  GridRowClickEvent,
  GridItemChangeEvent,
  GridDataStateChangeEvent,
} from '@progress/kendo-react-grid';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { GridItem, GridProps } from './types';
import { State } from '@progress/kendo-data-query';
import cx from 'classnames';
import useStyles from './styles';
import { withThemeNext } from '../../../../layout/theme-next';
import ClearIcon from '@material-ui/icons/ClearRounded';
import DoneIcon from '@material-ui/icons/DoneRounded';
import { Button } from '../../../../components/forms/fields-next';
import { FBDocTypeGroup } from '../../../FBApprovalMatrixTable/FBApprovalMatrixTable.types';
import { Mode, MODE_FIELD } from './constants';

// @todo: be
// @todo: data-cy
// @todo: translations
// @todo: refactoring
// @todo: optimisations
// @todo: filterTemplate
// @todo: fullscreen

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Grid<T extends GridItem> (props: GridProps<T>): React.ReactElement {
  const {
    data: originData,
    schema,
    disabled, onSave,
    ...restProps
  } = props;
  const classes = useStyles();

  const [data, setData] = useState(originData);
  const [prevDataItem, setPrevDataItem] = useState<T>();

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
    handleItemDiscard(undefined as any);

    // @todo: fix default values.
    const newItem = {
      id: random(0, 1000),
      docType: {
        name: '',
        group: FBDocTypeGroup.OTHER,
        active: true,
        acronym: '',
        category: '',
        needsSignature: false,
        defaultTraining: false,
      },
      approvalRoles: {
        stage1: [false, false, false, false, false, false],
        stage2: [false, false, false, false, false, false],
        stage3: [false, false, false, false, false, false],
        admStage: [false, false, false, false, false, false],
      },
      [MODE_FIELD]: Mode.add,
    };

    setData((data) => [...data, newItem as any]);
  };

  // Scroll down.
  useEffect(
    () => {
      const isAdding = data.some(
        (dataItem) => dataItem[MODE_FIELD] === Mode.add,
      );

      if (!isAdding) {
        return;
      }

      // @todo: use Grid API
      const element = document.querySelector('.k-virtual-content');
      element && (element.scrollTop = element.scrollHeight);
    },
    [data],
  );

  const handleRowClick = ({ dataItem: clickedDataItem }: GridRowClickEvent) => {
    handleItemDiscard(undefined as any);
    setPrevDataItem(cloneDeep(clickedDataItem));

    setData((data) => data.map((dataItem) => {
      if (dataItem.id !== clickedDataItem.id) {
        dataItem[MODE_FIELD] = Mode.show;
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
    setData((data) => {
      const newData = data.map((dataItem) => {
        // @todo: fix new items adding
        if (typeof dataItem.id === 'number') {
          dataItem[MODE_FIELD] = Mode.show;
          return dataItem;
        }

        if (dataItem.id !== prevDataItem?.id) {
          return dataItem;
        }

        dataItem[MODE_FIELD] = Mode.show;

        return dataItem;
      });

      // @todo: Fix BE. Now it doesn't save new items.
      onSave?.(newData.filter((dataItem) => typeof dataItem.id === 'string'));

      return newData;
    });

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

  const rowRender: GridProps<T>['rowRender'] = (row, props) => {
    const { dataItem } = props;

    const isUpdating = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
    const isActive = Boolean(dataItem?.docType?.active);

    if (!isUpdating) {
      if (isActive) {
        return row;
      }

      return React.cloneElement(
        row,
        {
          ...row.props,
          className: cx(row.props.className, classes.inactive),
        },
      );
    }

    const actions = (
      <td className={classes.actionsTd}>
        <div className={classes.line} />
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
      </td>
    );

    return React.cloneElement(
      row,
      {
        ...row.props,
        className: cx(row.props.className, classes.updating),
      },
      row.props.children,
      actions,
    );
  };

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
        onRowClick={!disabled ? handleRowClick : undefined}
        onItemChange={handleItemChange}
        onDataStateChange={handleDataStateChange}
        filterable
        fullWidth
        hasBoxScrollbars
        {...restProps}
      />
      {!disabled && (
        <Button
          className={classes.buttonAdd}
          kind="add"
          onClick={handleAdd}
        >
          Add item
        </Button>
      )}
    </>
  );
}

export default withThemeNext(Grid);

export * from './constants';
export * from './types';
