import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import FB from '../helpers/FB';
import { FIELDS_TO_OMIT, SUPPLIER_KEYS } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableSupplierContact, FBSupplierContactsProps, SupplierContactEditEvent } from './types';
import { withFBSupplierContacts } from './wrap';

const FBSupplierContacts: React.FC<FBSupplierContactsProps> = ({
  label = 'form.builder.supplier.contacts.title',
  name = '',
  disabled,
  contacts = [],
  setPrimaryContact,
  setContacts,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const isActive = !disabled;
  const [editedContact, setEditedContact] = useState<Partial<EditableSupplierContact>>();

  const isContactAdded = editedContact?.[MODE_FIELD] === Mode.add;
  const editContact = ({ dataItem }: SupplierContactEditEvent) => setEditedContact(dataItem);
  const isInEditMode = editedContact !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editContact : undefined;

  const formik = useFormik<Partial<EditableSupplierContact>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableSupplierContact>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const supplierContacts: EditableSupplierContact[]
        = workspaceState?.formInputSync.get(name) ?? [];
      const updatedContact = omit(values, FIELDS_TO_OMIT);

      const updatedContacts = isAddition
        ? [...supplierContacts, updatedContact]
        : supplierContacts.map((contact) =>
          contact.id === values.id
            ? updatedContact
            : updatedContact.isPrimary
              ? { ...contact, isPrimary: false }
              : contact,
        );

      formState?.setFieldValue(name, updatedContacts);
      workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [SUPPLIER_KEYS.SUPPLIER_PRODUCT_SERVICE_PROVIDED_KEY]: workspaceState.formInputSync.get(SUPPLIER_KEYS.SUPPLIER_PRODUCT_SERVICE_PROVIDED_KEY),
        [name]: updatedContacts,
      });
      discardContact();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedContact ?? {} });
  }, [editedContact, setValues, resetForm]);

  const createDraftContact = () => setEditedContact({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const discardContact = () => setEditedContact(undefined);

  const onDeleteContact = (dataItem: EditableSupplierContact) => {
    if (!editedContact) return;
    const updatedContacts = contacts.filter((contact) =>
      contact.id !== dataItem.id,
    );
    setContacts(updatedContacts);
  formState?.setFieldValue(name, updatedContacts);
  workspaceState?.saveDocRev({
    ...workspaceState?.formInput,
    [SUPPLIER_KEYS.SUPPLIER_PRODUCT_SERVICE_PROVIDED_KEY]: workspaceState.formInputSync.get(SUPPLIER_KEYS.SUPPLIER_PRODUCT_SERVICE_PROVIDED_KEY),
    [name]: updatedContacts,
  });
  discardContact();
  };

  const rowRender: DataGridProps<EditableSupplierContact>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableSupplierContact;
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
    isActive,
    isInEditMode,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardContact,
    onDelete: onDeleteContact,
    onPrimaryChange: setPrimaryContact,
  });

  const contactsList = contacts.reduce((list, item) => {
    const isContactEdited = editedContact && editedContact.id === item.id;

    return [
      ...list,
      {
        ...(isContactEdited ? editedContact : item),
        [MODE_FIELD]: isContactEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isContactAdded ? [editedContact] : []);

  return (
    <Box className={classes.root} data-cy="contacts">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="contacts" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              disabled={isInEditMode}
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftContact}
              data-cy="add-link"
            >
              {translate('form.builder.supplier.contacts.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <KendoDataGrid<EditableSupplierContact>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={contactsList as EditableSupplierContact[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftContact}
          data-cy="add-button"
        >
          {translate('form.builder.supplier.contacts.add')}
        </Button>
      )}
    </Box>
  );
};

export default withFBSupplierContacts(FBSupplierContacts);
