import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../common/intl';
import { Button } from '../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import FB from '../../helpers/FB';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableSiteContact, SiteContactEditEvent, SiteContactProps } from './types';

const SiteContact: React.FC<SiteContactProps> = ({
  name,
  disabled,
  dataItem,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const isActive = !disabled;
  const [siteContact, setSiteContact] = React.useState(dataItem.siteContact || []);
  const [editedSiteContact, setEditedSite] = useState<Partial<EditableSiteContact>>();

  const isSiteAdded = editedSiteContact?.[MODE_FIELD] === Mode.add;
  const editContact = ({ dataItem }: SiteContactEditEvent) => setEditedSite(dataItem);
  const isInEditMode = editedSiteContact !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editContact : undefined;

  const formik = useFormik<Partial<EditableSiteContact>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableSiteContact>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const siteContact: EditableSiteContact[]
        = workspaceState?.formInput?.[name] ?? [];
      const updatedSite = omit(values, FIELDS_TO_OMIT);

      const updatedSites = isAddition
        ? [...siteContact, updatedSite]
        : siteContact.map((site) =>
          site.id === values.id
            ? updatedSite
            : site,
        );

      formState?.setFieldValue(name, updatedSites);
      workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [name]: updatedSites,
      });
      onDiscardSite();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedSiteContact ?? {} });
  }, [editedSiteContact, setValues, resetForm]);

  const createSite = () => setEditedSite({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const onDiscardSite = () => setEditedSite(undefined);

  const onDeleteSite = (dataItem: EditableSiteContact) => {
    if (!editedSiteContact) return;
    const updatedSites = siteContact.filter((site) =>
      site.id !== dataItem.id,
    );
    // TODO update required here
    setSiteContact(updatedSites);
  formState?.setFieldValue(name, updatedSites);
  workspaceState?.saveDocRev({
    ...workspaceState?.formInput,
    [name]: updatedSites,
  });
  onDiscardSite();
  };

  const rowRender: DataGridProps<EditableSiteContact>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableSiteContact;
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
    onDiscard: onDiscardSite,
    onDelete: onDeleteSite,
  });

  const siteContactList = siteContact.reduce((list, item) => {
    const isSiteEdited = editedSiteContact && editedSiteContact.id === item.id;

    return [
      ...list,
      {
        ...(isSiteEdited ? editedSiteContact : item),
        [MODE_FIELD]: isSiteEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isSiteAdded ? [editedSiteContact] : []);

  return (
    <Box className={classes.root} data-cy="contact">
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
          onClick={createSite}
          data-cy="add-contact-button"
        >
          {translate('form.builder.customer.site.add.contact')}
        </Button>
      )}
    </Box>
  );
};

export default SiteContact;
