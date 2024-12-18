import { Box } from '@material-ui/core';
import { GridDetailRowProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import { EXPAND_FIELD, FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import SiteContact from './SiteContact';
import useStyles from './styles';
import { EditableSite, FBSiteProps, SiteEditEvent } from './types';
import { setPrimaryFieldDefaultValue } from './utils';
import { withFBSiteInformation } from './wrap';

const FBSiteInformation: React.FC<FBSiteProps> = ({
  label = 'form.builder.customer.site.information',
  name = '',
  disabled,
  sites = [],
  setSites,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const isActive = !disabled;
  const [editedSite, setEditedSite] = useState<Partial<EditableSite>>();

  const isSiteAdded = editedSite?.[MODE_FIELD] === Mode.add;
  const editContact = ({ dataItem }: SiteEditEvent) => setEditedSite(dataItem);
  const isInEditMode = editedSite !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editContact : undefined;

  const formik = useFormik<Partial<EditableSite>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableSite>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const sites: EditableSite[]
        = workspaceState?.formInput?.[name] ?? [];
      const updatedSite = omit(values, FIELDS_TO_OMIT);
      updatedSite.primary = setPrimaryFieldDefaultValue(updatedSite.primary);

      const toggleExclusiveFields = (
        contact: EditableSite,
      ) => ({
        ...contact,
        zipCode: Number(contact.zipCode),
        primary: updatedSite.primary ? false : contact.primary,
      });

      const updatedSites = isAddition
        ? [...sites.map(toggleExclusiveFields), updatedSite]
        : sites.map((site) =>
          site.id === values.id
            ? updatedSite
            : toggleExclusiveFields(site),
        );

      formState?.setFieldValue(name, updatedSites);
      workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [name]: updatedSites,
      });
      onDiscardSite();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedSite ?? {} });
  }, [editedSite, setValues, resetForm]);

  const createSite = () => setEditedSite({
    id: uuidv4(),
    primary: sites.length === 0,
    [MODE_FIELD]: Mode.add,
  });

  const onDiscardSite = () => setEditedSite(undefined);

  const onDeleteSite = (dataItem: EditableSite) => {
    if (!editedSite) return;
    const updatedSites = sites.filter((site) =>
      site.id !== dataItem.id,
    );
    setSites(updatedSites as EditableSite[]);
  formState?.setFieldValue(name, updatedSites);
  workspaceState?.saveDocRev({
    ...workspaceState?.formInput,
    [name]: updatedSites,
  });
  onDiscardSite();
  };

  const rowRender: DataGridProps<EditableSite>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableSite;
    const isUpdating = item[MODE_FIELD] && [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
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

  const handleSameAsHQ = useCallback((sameAsHQ) => {
    const hqAddress = workspaceState?.formInput;
    formik.setValues({
      ...editedSite,
      zipCode: sameAsHQ ? hqAddress?.headquarter_address_zip_code || '' : '',
      siteAddress: sameAsHQ ? hqAddress?.headquarter_address || '' : '',
      city: sameAsHQ ? hqAddress?.headquarter_address_city || '' : '',
      country: sameAsHQ ? hqAddress?.headquarter_address_country || '' : '',
      sameAsHQ,
    });
  }, [workspaceState?.formInput, editedSite]);

  const schema = buildSchema({
    isActive,
    isInEditMode,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: onDiscardSite,
    onDelete: onDeleteSite,
    onSameAsHQ: handleSameAsHQ,
  });

  const siteList = useMemo(() => {
    return sites.reduce((list, item) => {
      const isSiteEdited = editedSite && editedSite.id === item.id;
      const site = {
        ...(isSiteEdited ? editedSite : item),
        [MODE_FIELD]: isSiteEdited ? Mode.edit : Mode.show,
        [EXPAND_FIELD]: true,
      };

      list.push(site);
      return list;
    }, isSiteAdded ? [editedSite] : []);
  }, [sites, editedSite, isSiteAdded]);

  const memoizedSites = useMemo(() => sites, [sites?.length]);
  const memoizedName = useMemo(() => name, [name]);

  const DetailComponent = memo((props: GridDetailRowProps) => {
    return (
      <SiteContact {...props} name={memoizedName} sites={memoizedSites} />
    );
  });

  return (
    <Box className={classes.root} data-cy="site-information">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="siteInformations" name={name}>
        <FBSection label={label} />
      </FBInput>
      <KendoDataGrid<EditableSite>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        detail={DetailComponent}
        expandField={EXPAND_FIELD}
        data={siteList as EditableSite[]}
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
          data-cy="add-button"
        >
          {translate('form.builder.customer.site.add.site')}
        </Button>
      )}
    </Box>
  );
};

export default withFBSiteInformation(FBSiteInformation);
