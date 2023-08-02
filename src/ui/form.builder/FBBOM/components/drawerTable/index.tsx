import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import NoDataFound from '../../../../components/common/kendo/NoDataFound';
import { Button } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { AlternatePartEditEvent, EditableAlternatePart, FBBOMDrawerTableProps } from '../treelist/interface';
import { ActionsCell } from './components/Actions';
import { columns as schema } from './constants';
import alternateParts from './data';
import useStyles from './styles';

const FBBOMDrawerTable: React.FunctionComponent<FBBOMDrawerTableProps> = () => {
  const classes = useStyles();

  const [editedAlternatePart, setEditedAlternatePart] = React.useState<EditableAlternatePart>();
  const formik = useFormik<Partial<EditableAlternatePart>>({
    initialValues: {},
    onSubmit: (values) => {
      console.log('values ::', values);
    },
  });

  const createDraftLotTransfer = () => setEditedAlternatePart({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const editLotTransfer = ({ dataItem }: AlternatePartEditEvent) => setEditedAlternatePart(dataItem);

  const discardAlternatePart = () => {
    // TODO
  };
  const deleteAlternatePart = () => {
    // TODO
  };

  const rowRender: DataGridProps<EditableAlternatePart>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableAlternatePart;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD] as Mode);

    if (!isUpdating) {
      return row;
    }

    const actions = (
      <td className={classes.actionsCell} key="actions">
        <ActionsCell
          dataItem={item}
          onConfirm={formik.submitForm}
          onDiscard={discardAlternatePart}
          onDelete={deleteAlternatePart}
          rootClassName={classes.popperHolder}
        />
      </td>
    );

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
    );
  };

  const isAlternatePartAdded = editedAlternatePart?.[MODE_FIELD] === Mode.add;

  const enableAddField = true;
  const handleRowClick = enableAddField && !editedAlternatePart ? editLotTransfer : undefined;

  const alternatePartList = alternateParts.reduce((list, alternatePart) => {
    const isAlternatePartEdited = editedAlternatePart && editedAlternatePart.id === alternatePart.id;

    return [
      ...list,
      {
        ...(isAlternatePartEdited ? editedAlternatePart : alternatePart),
        [MODE_FIELD]: isAlternatePartEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isAlternatePartAdded ? [editedAlternatePart] : []);

  return (
    <div>
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableAlternatePart>
          fullWidth={false}
          filterable={false}
          hasBoxScrollbars
          schema={schema}
          data={alternatePartList}
          rowRender={rowRender}
          onRowClick={handleRowClick}
          fallback={<NoDataFound />}
        />
      </FormikProvider>
      {enableAddField && <Button
        kind="add"
        fullWidth
        onClick={createDraftLotTransfer}
      >
        {translate('form.builder.lot.transfers.add')}
      </Button>}
    </div>
  );
};

export default FBBOMDrawerTable;
