import { Box } from '@material-ui/core';
import { GridDetailRowProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit, uniq } from 'lodash';
import React, { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { BooleanRef } from './SiteContact/types';
import useStyles from './styles';
import { EditableSite, FBSiteProps, Site, SiteEditEvent } from './types';
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
  const [expandedSiteIDs, setExpandedSiteIDs] = useState<string[]>();
  const isExapandAll = useRef<boolean>(false);

  const isEditingRef = useRef<BooleanRef>(null);
  const isSiteAdded = editedSite?.[MODE_FIELD] === Mode.add;
  const editContact = ({ dataItem }: SiteEditEvent) => {
    if (isEditingRef?.current) { return; }
    setEditedSite(dataItem);
  };
  const isInEditMode = editedSite !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editContact : undefined;

  const formik = useFormik<Partial<EditableSite>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableSite>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const sites: EditableSite[]
        = workspaceState?.formInput?.[name] ?? [];
      const updatedSite = omit(values, FIELDS_TO_OMIT);
      updatedSite.isPrimary = updatedSite.isPrimary ?? false;

      const toggleSitePrimaryFields = (
        siteInfo: EditableSite,
      ) => ({
        ...siteInfo,
        zipCode: siteInfo.zipCode ?? '',
        isPrimary: updatedSite.isPrimary ? false : siteInfo.isPrimary,
      });

      const updatedSites = sites.map((site: EditableSite) =>
        isAddition ? toggleSitePrimaryFields(site) : site.id === values.id ? updatedSite : toggleSitePrimaryFields(site),
      );

      if (isAddition) {
        updatedSites.push(updatedSite);
      }

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

  const createSite = () => !isEditingRef?.current && setEditedSite({
    id: uuidv4(),
    isPrimary: sites.length === 0,
    [MODE_FIELD]: Mode.add,
  });

  const onDiscardSite = () => setEditedSite(undefined);

  const onDeleteSite = (dataItem: EditableSite) => {
    if (!editedSite) return;
    const updatedSites = sites.filter((site) => site.id !== dataItem.id);
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

  const handleSameAsHQ = useCallback((isSameAsHQ, currentSite) => {
    const hqAddress = workspaceState?.formInput;
    formik.setValues({
      ...currentSite,
      zipCode: isSameAsHQ ? hqAddress?.headquarterAddressZipCode ?? '' : '',
      siteAddress: isSameAsHQ ? hqAddress?.headquarterAddress ?? '' : '',
      city: isSameAsHQ ? hqAddress?.headquarterAddressCity ?? '' : '',
      country: isSameAsHQ ? hqAddress?.headquarterAddressCountry ?? '' : '',
      isSameAsHQ: isSameAsHQ,
    });
  }, [workspaceState?.formInput, editedSite]);

  const getAllItemIds = (items: Site[]) => {
    if (!items) return [];
    const ids: string[] = [];
    items.forEach((item) => {
      ids.push(item.id);
    });
    return uniq(ids);
  };

  const toggleExpandCollapseAll = (toggle: boolean) => {
    isExapandAll.current = toggle;
    if (toggle) {
      const expanded = getAllItemIds(sites);
      setExpandedSiteIDs(expanded);
      return;
    }
    setExpandedSiteIDs([]);
  };

  const handleDataItemExpanded = useCallback((dataItem: EditableSite) => {
    if (isEditingRef.current) { return; }
    const selectedId = dataItem.id;
    setExpandedSiteIDs((prevIds = []) =>
      prevIds.includes(selectedId)
        ? prevIds.filter(id => id !== selectedId)
        : [...prevIds, selectedId],
    );
  }, []);

  const schema = buildSchema({
    isActive,
    isInEditMode,
    actionsClass: classes.actionsCell,
    isExapandAll: isExapandAll.current,
    toggleExpandCollapseAll,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: onDiscardSite,
    onDelete: onDeleteSite,
    onSameAsHQ: handleSameAsHQ,
    onDataItemExpanded: handleDataItemExpanded,
  });

  const siteList = useMemo(() => {
    const updatedList = isSiteAdded && editedSite ? [editedSite] : [];

    return [
      ...updatedList,
      ...sites.map((item: Site) => {
        if (editedSite?.id === item.id) {
          return { ...editedSite, [MODE_FIELD]: Mode.edit, [EXPAND_FIELD]: true };
        }
        return { ...item, [MODE_FIELD]: Mode.show, [EXPAND_FIELD]: expandedSiteIDs?.includes(item.id) };
      }),
    ];
  }, [sites, editedSite, isSiteAdded, expandedSiteIDs]);

  const LazyDetailComponent = lazy(async () => await import('./SiteContact'));

  const DetailComponent = memo((props: GridDetailRowProps) => {
    return (
      <Suspense fallback={<div>{translate('common.loading')}</div>}>
        <LazyDetailComponent {...props} ref={isEditingRef} name={name} sites={sites} setSites={setSites} isDisabled={disabled || Boolean(editedSite)} />
      </Suspense>
    );
  });

  return (
    <Box className={classes.root} data-cy="site-information">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="siteInformation" name={name}>
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
