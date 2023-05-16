import React, { useEffect, useState } from 'react';
import { cloneDeep, kebabCase } from 'lodash';
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
import { Mode, MODE_FIELD, DEFAULT_DATA_STATE } from '.';
import { translate } from '../../../../../common/intl';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';

// @todo: refactoring
// @todo: optimisations
// @todo: filterTemplate
// @todo: correct row borders style

function Grid<T> (props: GridProps<T>): React.ReactElement {
  const {
    data: originData,
    schema,
    disabled, onSave,
    defaultNewValue,
    withoutStatus,
    ...restProps
  } = props;
  const classes = useStyles();

  const [data, setData] = useState<Array<GridItem<T>>>(originData);
  const [prevDataItem, setPrevDataItem] = useState<GridItem<T>>();

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

    const newItem = {
      ...defaultNewValue,
      [MODE_FIELD]: Mode.add,
    } as GridItem<T>;

    setData((data) => [...data, newItem]);
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
        if (dataItem.id && dataItem.id !== prevDataItem?.id) {
          return dataItem;
        }

        dataItem[MODE_FIELD] = Mode.show;

        return dataItem;
      });

      onSave?.(newData);

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
    const isInactive = dataItem?.docType?.active === false;
    const dataCy = `row-${kebabCase(dataItem?.docType?.name?.toLowerCase())}`;

    if (!isUpdating) {
      return React.cloneElement(
        row,
        {
          ...row.props,
          ['data-cy' as string]: dataCy,
          className: cx(row.props.className, { [classes.inactive]: isInactive }),
        },
      );
    }

    const actions = (
      <td className={classes.actionsTd}>
        <div className={classes.line} />
        <div className={classes.actions}>
          <StyleTooltip
            title={translate('common.discard')}
            placement="top"
            arrow
          >
            <Button
              data-cy="action-discard"
              className={classes.actionButton}
              variant="outlined"
              onClick={handleItemDiscard}
            >
              <ClearIcon className={classes.iconButton} />
            </Button>
          </StyleTooltip>
          <StyleTooltip
            title={translate('common.save')}
            placement="top"
            arrow
          >
            <Button
              data-cy="action-save"
              className={classes.actionButton}
              variant="outlined"
              onClick={handleItemSave}
            >
              <DoneIcon className={classes.iconButton} />
            </Button>
          </StyleTooltip>
        </div>
      </td>
    );

    return React.cloneElement(
      row,
      {
        ...row.props,
        ['data-cy' as string]: dataCy,
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
        defaultDataState={!withoutStatus ? DEFAULT_DATA_STATE : undefined}
        filterable
        fullWidth
        hasBoxScrollbars
        {...restProps}
      />
      {!disabled && (
        <Button
          data-cy="button-add"
          className={classes.buttonAdd}
          kind="add"
          onClick={handleAdd}
        >
          {translate('form.builder.am.add')}
        </Button>
      )}
    </>
  );
}

export default withThemeNext(Grid);

export * from './constants';
