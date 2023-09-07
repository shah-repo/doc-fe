import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import NoDataFound from '../../../../components/common/kendo/NoDataFound';
import { Button } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { AlternatePartEditEvent, EditableAlternatePart, FBBOMDrawerTableProps } from '../treelist/interface';
import { ActionsCell } from './components/Actions';
import { schema } from './constants';
import useStyles from './styles';

const FBBOMDrawerTable: React.FunctionComponent<FBBOMDrawerTableProps> = ({ parentRevId }) => {
  const classes = useStyles();

  const fetchAlternateParts = useActionCreator(
    documentRevisionsActions.fetchAlternateParts,
  );
  const addAlternateParts = useActionCreator(
    documentRevisionsActions.addAlternatePart,
  );
  const deleteAlternateParts = useActionCreator(
    documentRevisionsActions.deleteAlternatePart,
  );
  const [alternateParts, setAlternateParts] = useState<EditableAlternatePart[]>();
  const [editedAlternatePart, setEditedAlternatePart] = useState<EditableAlternatePart>();
  const formik = useFormik<Partial<EditableAlternatePart>>({
    initialValues: {},
    onSubmit: (values) => {
      alternatePartAsync.start(
        addAlternateParts,
        {
          parentNodeRevId: parentRevId,
          alternatePartNodeRevId: values.id,
        },
        alternatePartAsync,
      );
    },
  });
  const alternatePartAsync = useAsync({
    onSuccess: () => {
      fetchAlternatePartAsync.start(
        fetchAlternateParts,
        parentRevId,
        fetchAlternatePartAsync,
      );
    },
    onError: (response) => {
      toastError(response);
    },
  });

  const fetchAlternatePartAsync = useAsync({
    onSuccess: (response?: EditableAlternatePart[]) => {
      setAlternateParts(response);
      discardAlternatePart();
    },
    onError: (response) => {
      toastError(response);
    },
  });

  useEffect(() => {
    if (!parentRevId) {
      return;
    }
    fetchAlternatePartAsync.start(
      fetchAlternateParts,
      parentRevId,
      fetchAlternatePartAsync,
    );
  }, [parentRevId]);

  const AddAlternatePart = () => setEditedAlternatePart({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const editAlternatePart = ({ dataItem }: AlternatePartEditEvent) => setEditedAlternatePart(dataItem);

  const discardAlternatePart = () => {
    setEditedAlternatePart(undefined);
    formik.resetForm();
  };
  const deleteAlternatePart = (dataItem) => {
    alternatePartAsync.start(
      deleteAlternateParts,
      parentRevId,
      dataItem.id,
      alternatePartAsync,
    );
  };

  const rowRender: DataGridProps<EditableAlternatePart>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableAlternatePart;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);

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
  const handleRowClick = enableAddField && !editedAlternatePart ? editAlternatePart : undefined;

  const alternatePartList = alternateParts?.reduce((list, alternatePart) => {
    const isAlternatePartEdited = editedAlternatePart && editedAlternatePart.id === alternatePart.id;

    return [
      {
        ...(isAlternatePartEdited ? editedAlternatePart : alternatePart),
        [MODE_FIELD]: isAlternatePartEdited ? Mode.edit : Mode.show,
      },
      ...list,
    ];
  }, isAlternatePartAdded ? [editedAlternatePart] : []);

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableAlternatePart>
          fullWidth={false}
          filterable={false}
          hasBoxScrollbars
          schema={schema}
          loading= {fetchAlternatePartAsync.isLoading || alternatePartAsync.isLoading}
          data={alternatePartList ?? []}
          rowRender={rowRender}
          onRowClick={handleRowClick}
          fallback={<NoDataFound />}
        />
      </FormikProvider>
      {enableAddField && <Button
        kind="add"
        fullWidth
        onClick={AddAlternatePart}
        style={{ marginTop: '-4px' }}
        className={classes.addPartButton}
      >
        {translate('bom.alternate.part.add')}
      </Button>}
    </Box>
  );
};

export default FBBOMDrawerTable;
