import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../common/intl';
import { Button } from '../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import FB from '../../helpers/FB';
import { EditableSite } from '../types';
import { setPrimaryFieldDefaultValue } from '../utils';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import {
  EditableSiteContact,
  siteContact,
  SiteContactEditEvent,
  SiteContactProps,
} from './types';

const SiteContact: React.FC<SiteContactProps> = ({
  name,
  disabled,
  sites,
  dataItem,
  setSites,
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const isActive = !disabled;
  const [siteContact, setSiteContact] = React.useState(
    dataItem.siteContact || [],
  );
  const [editedSiteContact, setEditedSite]
    = useState<Partial<EditableSiteContact>>();
  const isSiteAdded = editedSiteContact?.[MODE_FIELD] === Mode.add;
  const editContact = ({ dataItem }: SiteContactEditEvent) =>
    setEditedSite(dataItem);
  const isInEditMode = editedSiteContact !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editContact : undefined;
  console.log('origionalSites:', sites);

  const formik = useFormik<Partial<EditableSiteContact>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableSiteContact>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const updatedSite = omit(values, FIELDS_TO_OMIT);
      updatedSite.primary = setPrimaryFieldDefaultValue(updatedSite.primary);
      updatedSite.attention = setPrimaryFieldDefaultValue(updatedSite.attention);
      updatedSite.shipping = setPrimaryFieldDefaultValue(updatedSite.shipping);

      const toggleExclusiveFields = (
        contact: EditableSiteContact | siteContact,
      ) => ({
        ...contact,
        primary: updatedSite.primary ? false : contact.primary,
        shipping: updatedSite.shipping ? false : contact.shipping,
        attention: updatedSite.attention ? false : contact.attention,
      });

      const updatedSiteContacts = isAddition
        ? [...siteContact.map(toggleExclusiveFields), updatedSite]
        : siteContact.map((contact) =>
          contact.id === values.id
            ? updatedSite
            : toggleExclusiveFields(contact),
        );

      const updatedSites = sites?.map((site) =>
        site.id === dataItem.id
          ? { ...site, siteContact: updatedSiteContacts }
          : site,
      );

      setSiteContact(updatedSiteContacts as siteContact[]);
      formState?.setFieldValue(name, updatedSites);
      setSites?.(updatedSites as EditableSite[]);
      workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [name]: updatedSites,
      });
      onDiscardSiteContact();
    },
  });

  const { submitForm: submitSiteContactForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedSiteContact ?? {} });
  }, [editedSiteContact, setValues, resetForm]);

  const createSiteContact = () =>
    setEditedSite({
      id: uuidv4(),
      primary: siteContact.length === 0,
      [MODE_FIELD]: Mode.add,
    });

  const onDiscardSiteContact = () => setEditedSite(undefined);

  const onDeleteSiteContact = useCallback(
    (dataItem: EditableSiteContact) => {
      if (!editedSiteContact) return;

      const updatedSiteContacts = siteContact?.filter((site) => site.id !== dataItem.id);
      setSiteContact(updatedSiteContacts);
      const updatedSites = sites?.map((site) => ({
        ...site,
        siteContact: site.siteContact?.filter((contact) => contact.id !== dataItem.id),
      }));
      formState?.setFieldValue(name, updatedSites);
      setSites?.(updatedSites as EditableSite[]);
      workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [name]: updatedSites,
      });
      onDiscardSiteContact();
    },
    [editedSiteContact, siteContact, setSiteContact, sites, formState, name, workspaceState, onDiscardSiteContact],
  );

  const rowRender: DataGridProps<EditableSiteContact>['rowRender'] = (
    row,
    { dataItem },
  ) => {
    const item = dataItem as EditableSiteContact;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(row, {
      className: cx(row.props.className, classes.updatingRow),
    });

    return <FormikProvider value={formik}>{editedRow}</FormikProvider>;
  };

  const schema = buildSchema({
    isActive,
    isInEditMode,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitSiteContactForm,
    onDiscard: onDiscardSiteContact,
    onDelete: onDeleteSiteContact,
  });

  const siteContactList = useMemo(() => {
    return siteContact?.reduce(
      (list, item) => {
        const isSiteEdited = editedSiteContact && editedSiteContact.id === item.id;

        return [
          ...list,
          {
            ...(isSiteEdited ? editedSiteContact : item),
            [MODE_FIELD]: isSiteEdited ? Mode.edit : Mode.show,
          },
        ];
      },
      isSiteAdded ? [editedSiteContact] : [],
    );
  }, [siteContact, editedSiteContact, isSiteAdded]);

  return (
    <Box className={classes.root} data-cy="site-contact">
      <KendoDataGrid<EditableSiteContact>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={siteContactList as EditableSiteContact[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createSiteContact}
          data-cy="add-contact-button"
        >
          {translate('form.builder.customer.site.add.contact')}
        </Button>
      )}
    </Box>
  );
};

export default memo(SiteContact);
