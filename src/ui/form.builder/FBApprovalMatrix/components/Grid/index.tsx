import cx from 'classnames';
import { cloneDeep, kebabCase, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { DEFAULT_DATA_STATE, Mode, MODE_FIELD } from '.';
import { translate } from '../../../../../common/intl';
import { Button } from '../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { withThemeNext } from '../../../../layout/theme-next';
import Actions from '../../../FBApprovalMatrixRoles/components/Actions';
import useStyles from './styles';
import { GridItem, GridProps } from './types';

function normalizeData <T> (data: T[]): T[] {
  return cloneDeep(data).map(dataItem => {
    dataItem[MODE_FIELD] = Mode.show;
    return dataItem;
  });
}

function Grid<T> (props: GridProps<T>): React.ReactElement {
  const {
    data: originData,
    schema,
    disabled, onSave,
    generateNewItem,
    withoutStatus,
    isFullScreenEnabled,
    ...restProps
  } = props;

  const withButton = !disabled;
  const classes = useStyles({ withButton, isFullScreenEnabled });

  const [data, setData] = useState<Array<GridItem<T>>>(normalizeData(originData));
  const [activeItem, setActiveItem] = useState<GridItem<T>>();

  useEffect(
    () => {
      setData(normalizeData(originData));
    },
    [originData],
  );

  useEffect(
    () => {
      setData((prevState) => {
        const data = prevState
          .filter((dataItem) => dataItem?.[MODE_FIELD] !== Mode.add)
          .map((dataItem) => {
            if (activeItem && dataItem.id === activeItem.id) {
              return set(dataItem, MODE_FIELD, dataItem.id ? Mode.edit : Mode.add);
            }
            return set(dataItem, MODE_FIELD, Mode.show);
          });

        if (activeItem?.[MODE_FIELD] === Mode.add) {
          return [...data, activeItem];
        }

        return data;
      });
    },
    [activeItem],
  );

  const handleDataStateChange: GridProps<T>['onDataStateChange'] = ({ dataState }) => {
    // Remove empty filters.
    if (dataState.filter?.filters) {
      dataState.filter.filters = dataState.filter.filters
        .filter((item) => {
          if ('value' in item) {
            return item.value !== undefined;
          }

          return true;
        });
    }

    return dataState;
  };

  const isAdding = data.some((dataItem) => dataItem[MODE_FIELD] === Mode.add);

  const handleAdd: React.MouseEventHandler = () => {
    const newItem = {
      ...generateNewItem?.(),
      [MODE_FIELD]: Mode.add,
    } as GridItem<T>;

    setActiveItem(newItem);
  };

  const handleRowClick: GridProps<T>['onRowClick'] = ({ dataItem }) => {
    if (activeItem?.id !== dataItem.id) {
      setActiveItem(cloneDeep(dataItem));
    }
  };

  const handleItemSave = (): void => {
    const newData = data.map((dataItem) => {
      if (activeItem && dataItem.id === activeItem.id) {
        return set(activeItem, MODE_FIELD, Mode.show);
      }

      return dataItem;
    });

    setData(newData);
    onSave?.(newData);

    setActiveItem(undefined);
  };

  const handleItemDiscard = () => setActiveItem(undefined);

  const handleItemChange: GridProps<T>['onItemChange'] = ({ field, value }) => {
    if (!activeItem || !field) {
      return;
    }

    setActiveItem(
      set(activeItem, field, value),
    );
  };

  const rowRender: GridProps<T>['rowRender'] = (row, props) => {
    const { dataItem } = props;

    const isUpdating = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
    const isInactive = dataItem?.docType?.active === false;

    const cyLabel = kebabCase(dataItem?.docType?.name?.toLowerCase())
      || (dataItem[MODE_FIELD] === Mode.add ? 'new' : 'empty');
    const dataCy = `row-${cyLabel}`;

    if (!isUpdating) {
      return React.cloneElement(
        row,
        {
          ['data-cy' as string]: dataCy,
          className: cx(row.props.className, { [classes.inactive]: isInactive }),
        },
      );
    }

    const actions = (
      <td className={classes.actionsTd}>
        <div className={classes.line} />
        <Actions
          dataItem={dataItem}
          onConfirm={handleItemSave}
          onDiscard={handleItemDiscard}
        />
      </td>
    );

    return React.cloneElement(
      row,
      {
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
    <AutoSizer disableHeight>
      {({ width }) => (
        <>
          <KendoDataGrid
            className={cx(classes.grid, { [classes.gridWithButton]: withButton })}
            style={{ width: width }}
            data={data}
            schema={schema}
            rowRender={rowRender}
            dataItemKey="id"
            onRowClick={!disabled ? handleRowClick : undefined}
            onDataStateChange={handleDataStateChange}
            onItemChange={handleItemChange}
            defaultDataState={!withoutStatus && data.length ? DEFAULT_DATA_STATE : undefined}
            filterable
            fullWidth
            hasBoxScrollbars
            {...restProps}
          />
          {withButton && (
            <Button
              data-cy="button-add"
              style={{ width: width }}
              className={classes.buttonAdd}
              kind="add"
              disabled={isAdding}
              onClick={handleAdd}
            >
              {translate('form.builder.am.add')}
            </Button>
          )}
        </>
      )}</AutoSizer>
  );
}

export default withThemeNext(Grid);

export * from './constants';
