import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { pick } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { ASLStatus } from '../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import DocumentRevisionDialog from '../../components/common/dialogs/DocumentRevisionDialog';
import { Button } from '../../components/forms/fields-next';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { SUPPLIER_KEYS } from '../FBSupplierContacts/constants';
import FB from '../helpers/FB';
import { FIELDS_TO_PICK } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableProductORService, FBProductORServiceProps, ProductORService, ProductORServiceEditEvent } from './types';
import { withFBProductORService } from './wrap';

const FBProductORService: React.FC<FBProductORServiceProps> = ({
  label = 'form.builder.supplier.product.or.service.title',
  name = '',
  disabled,
  productOrServices = [],
  setProductOrServices,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const [selectedDataItem, setSelectedDataItem] = useState<EditableProductORService>();
  const [aslItems, setAslItems] = useState<ASLStatus[]>();
  const fetchASLItems = useActionCreator(documentRevisionsActions.fetchASLSuppliersListData);
  const quickViewDialog = useDialog();
  const isActive = !disabled;
  const [editedItem, setEditedItem] = useState<Partial<EditableProductORService>>();
  const isItemAdded = editedItem?.[MODE_FIELD] === Mode.add;
  const editItem = ({ dataItem }: ProductORServiceEditEvent) => setEditedItem(dataItem);
  const isInEditMode = editedItem !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editItem : undefined;

  const fetchOptionsDataAsync = useAsync<ASLStatus[]>({
    onSuccess: setAslItems,
    onError: toastError,
  });

  useEffect(() => {
    fetchOptionsDataAsync.start(
      fetchASLItems,
      fetchOptionsDataAsync,
    );
  }, []);

  const formik = useFormik<Partial<EditableProductORService>>({
    initialValues: {},
    onSubmit: (values) => {
      const addedAslItem = aslItems?.find(aslItem => aslItem.id === values.aslStatusId);
      const isAddition = values[MODE_FIELD] === Mode.add;

      const updatedProductOrServices = isAddition
        ? [...productOrServices, { ...values, ...{ aslDisplayLabel: addedAslItem?.displayLabel } }]
        : productOrServices.map((reference) =>
          reference.id === values.id
            ? { values, ...{ aslDisplayLabel: addedAslItem?.displayLabel } }
            : reference,
        );

      const payload = updatedProductOrServices
        .map((productOrService) => {
          const obj = pick(productOrService, FIELDS_TO_PICK);
          if (obj.revId) {
            obj.title = '';
          }
          return obj;
        });

    formState?.setFieldValue(name, updatedProductOrServices);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      [SUPPLIER_KEYS.SUPPLIER_CONTACTS_KEY]: workspaceState.formInputSync.get(SUPPLIER_KEYS.SUPPLIER_CONTACTS_KEY),
      [name]: payload,
    });
    setProductOrServices(updatedProductOrServices as ProductORService[]);
    discardItem();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedItem ?? {} });
  }, [editedItem, setValues, resetForm]);

  const createDraftItem = () => setEditedItem({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const discardItem = () => setEditedItem(undefined);

  const removeItem = (dataItem: ProductORService) => {
    if (!editedItem) return;
    const updatedProductOrServices = productOrServices
      .filter((productOrService) =>
        productOrService.id !== dataItem.id,
      );
    const payload = updatedProductOrServices
      .map((productOrService) => pick(productOrService, FIELDS_TO_PICK));

    setProductOrServices(updatedProductOrServices);
    formState?.setFieldValue(name, updatedProductOrServices);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      [SUPPLIER_KEYS.SUPPLIER_CONTACTS_KEY]: workspaceState.formInputSync.get(SUPPLIER_KEYS.SUPPLIER_CONTACTS_KEY),
      [name]: payload,
    });
    discardItem();
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableProductORService) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender: DataGridProps<EditableProductORService>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableProductORService;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
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

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardItem,
    onDelete: removeItem,
    aslItems,
    onOpenQuickView: openQuickView,
  });

  const itemsList = productOrServices.reduce((list, item) => {
    const isItemEdited = editedItem && editedItem.id === item.id;

    return [
      ...list,
      {
        ...(isItemEdited ? editedItem : item),
        [MODE_FIELD]: isItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isItemAdded ? [editedItem] : []);

  return (
    <Box className={classes.root} data-cy="product-service">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="productorservice" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              disabled={isInEditMode}
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftItem}
              data-cy="add-link"
            >
              {translate('form.builder.add.item')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <KendoDataGrid<EditableProductORService>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={itemsList as EditableProductORService[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftItem}
          data-cy="add-button"
        >
          {translate('form.builder.add.item')}
        </Button>
      )}
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: selectedDataItem?.revId, parentRevId: workspaceState?.id }} />
    </Box>
  );
};

export default withFBProductORService(FBProductORService);
