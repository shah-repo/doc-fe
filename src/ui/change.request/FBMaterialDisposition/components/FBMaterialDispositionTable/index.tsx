import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Typography } from '@material-ui/core';
import { GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { map } from 'lodash';
import React, { useEffect } from 'react';
import { translate } from '../../../../../common/intl';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../../../components/Text';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import ColumnShowHideMDMenu from './components/ColumnShowHideMDMenu';
import { data } from './constants';
import { EditableMDItem, MaterialDispositionItem, MDItemEditEvent } from './interface';
import { buildSchema } from './schema';
import useStyles from './styles';

const FBMaterialDispositionTable: React.FunctionComponent = () => {
  const classes = useStyles();
  const [editedMDItem, setEditedMDItem] = React.useState<EditableMDItem>();
  const editMDItem = ({ dataItem }: MDItemEditEvent) => setEditedMDItem(dataItem);
  const discardMDItem = () => setEditedMDItem(undefined);
  const removeVendor = () => {
    if (!editedMDItem) {
      return;
    }
    // TO to delete MDItem via API
    discardMDItem();
  };
  const getColumns = () => {
    return columns.filter(({ show }) => show);
  };

  const formik = useFormik<Partial<EditableMDItem>>({
    initialValues: {},
    onSubmit: (values) => {
      discardMDItem();
      // TO DO to Integrate API
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedMDItem ?? {} });
  }, [editedMDItem, setValues, resetForm]);

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editMDItem,
    onConfirm: submitForm,
    onDiscard: discardMDItem,
    onDelete: removeVendor,
  });

  const [columns, setColumns] = React.useState<Array<ColumnDefinition<EditableMDItem>>>(schema);

  const onColumnShowHide = ({ field }: Partial<ColumnDefinition<EditableMDItem>>) => {
    const dataColumns = map(columns, (column: ColumnDefinition<EditableMDItem>) => {
      if (column.field === field) {
        column.show = !column.show;
      }
      return column;
    });
    setColumns(dataColumns);
  };

  const rowRender: DataGridProps<MaterialDispositionItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as MaterialDispositionItem;
    const isUpdating = [Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const MDItemList = data.reduce<EditableMDItem[]>((list, item) => {
    const isMDItemEdited = editedMDItem && editedMDItem.id === item.id;

    return [
      ...list,
      {
        ...(isMDItemEdited ? editedMDItem : item),
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, []);

  return (<>
    <KendoDataGrid<EditableMDItem>
      data={MDItemList}
      schema={getColumns()}
      fullWidth
      hasBoxScrollbars
      onRowClick={editMDItem}
      rowRender={rowRender}
    >
      <GridToolbar>
        <Grid container justify="flex-end"
          className={classes.toolbarContainer}
        >
          <Grid item>
            <Grid container justify="flex-end">
              <Grid className={classes.refreshContainer}
              >
                <StyleTooltip
                  title={translate('Refresh')}
                  placement="top"
                  arrow
                >
                  <Grid container>
                    <FontAwesomeIcon icon={regular('arrows-rotate')} className={classes.icon} />
                    <Typography
                      variant="h6"
                      component="h6"
                      className={classes.refreshText}
                    >
                      <Text message="As of July 22, 2023" />
                    </Typography>
                  </Grid>
                </StyleTooltip>
              </Grid>
              <Grid item >
                <StyleTooltip
                  title={translate('common.download')}
                  placement="top"
                  arrow
                >
                  <FontAwesomeIcon data-cy="excel-download"
                    className={classes.icon}
                    onClick={() => ({})}
                    icon={solid('arrow-down-to-line')} />
                </StyleTooltip>
              </Grid>
              <Grid item
                data-cy="show-hide-columns"
              >
                <ColumnShowHideMDMenu
                  columnDefinition={columns}
                  onChange={(item) => onColumnShowHide(item)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </GridToolbar>
    </KendoDataGrid>
  </>);
};

export default FBMaterialDispositionTable;
