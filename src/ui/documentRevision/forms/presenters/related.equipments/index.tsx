import { Box } from '@material-ui/core';
import cx from 'classnames';
import { Formik, FormikProps, FormikProvider, useFormik } from 'formik';
import { isEmpty, last, set } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { generateRelatedEquipmentDocId } from '.';
import { translate } from '../../../../../common/intl';
import { emptyFunction } from '../../../../../common/utils/helpers';
import { authSelectors } from '../../../../../state/ducks/auth';
import { companySelectors } from '../../../../../state/ducks/company';
import { documentTypeActions, documentTypeSelectors } from '../../../../../state/ducks/documentRevisions/documentType';
import { DocumentType, DocumentTypeById, DocumentTypeByIdForm } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { Button, ButtonGroup } from '../../../../components/forms/fields-next';
import { FormContext } from '../../../../components/forms/FormContext';
import PromptIfDirty from '../../../../components/forms/PromptIfDirty';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import MultipleFormTemplateDialog from '../../../../documentType/dialogs/MultipleFormTemplateDialog';
import { GridProps } from '../../../../form.builder/FBApprovalMatrix/components/Grid/types';
import FBSection from '../../../../form.builder/FBSection/FBSection';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { SELECT_FORM_INITIAL_VALUES } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { CreateRelatedEquipmentInput, EditableRelatedEquipment, RelatedEquipmentsProps } from './types';
import { withRelatedEquipments } from './wrap';

interface FormikValues {
  selectType: DocumentType[]
  selectForm: DocumentTypeByIdForm[]
}

const RelatedEquipments: React.FC<RelatedEquipmentsProps> = (props) => {
  const {
    parentDocumentRevision,
    disabled = false,
    loading,
    statuses = [],
    relatedEquipments = [],
    addRelatedEquipment,
  } = props;

  const classes = useStyles();
  const [newRelatedEquipment, setNewRelatedEquipment] = useState<Partial<EditableRelatedEquipment>>();

  const isActive = !disabled;
  const isInAddingMode = Boolean(newRelatedEquipment);

  const [relatedDocumentTypeId, setRelatedDocumentTypeId] = useState<string | undefined>();
  const [relatedFormDocumentId, setRelatedFormDocumentId] = useState<string | undefined>();
  const [initialValues, setInitialValues] = useState<FormikValues>(SELECT_FORM_INITIAL_VALUES);

  const formik = useFormik<Partial<CreateRelatedEquipmentInput>>({
    initialValues: {},
    onSubmit: (relatedEquipment) => {
      addRelatedEquipment?.({
        docId: relatedEquipment.docId as string,
        name: relatedEquipment.name as string,
        primaryOwner: relatedEquipment.primaryOwner as string,
        location: relatedEquipment.location as string,
        documentTypeId: relatedDocumentTypeId as string,
        formDocumentId: relatedFormDocumentId as string,
      });
      discardRelatedEquipments();
    },
  });

  const { submitForm, resetForm, setValues, dirty, setFieldValue } = formik;

  useEffect(() => {
    resetForm({ values: (newRelatedEquipment ?? {}) as Partial<CreateRelatedEquipmentInput> });
  }, [newRelatedEquipment, setValues, resetForm]);

  const companyMine = useSelector(companySelectors.getCompanyMine);
  const companySettings = useSelector(companySelectors.getGeneralSettings);

  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const documentTypesByCategory = useSelector(documentTypeSelectors.getDocumentTypesByCategory);
  const documentTypesAll = useSelector(documentTypeSelectors.getDocumentTypeList);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const formIds = useSelector(documentTypeSelectors.docRevTypeForms);
  const currentUser = useSelector(authSelectors.currentUser);

  const handleAddRelatedEquipment = (relatedDocumentTypeId: string) => {
    closeMultipleFormDialog();

    const documentType = documentTypesAll.find(item => item.id === relatedDocumentTypeId);
    const relatedAcronym = documentType?.documentTypeAcronym ?? '';

    setNewRelatedEquipment({
      name: '',
      displayRevision: '',
      createdBy: currentUser,
      status: DocumentRevisionStatus.Draft,
      docId: generateRelatedEquipmentDocId({ parentDocumentRevision, relatedEquipments, relatedAcronym }),
      [MODE_FIELD]: Mode.add,
    });
  };

  const discardRelatedEquipments = useCallback(
    () => {
      setNewRelatedEquipment(undefined);
    },
    [],
  );

  const rowRender: DataGridProps<EditableRelatedEquipment>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableRelatedEquipment;
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

  const relatedEquipmentsList = relatedEquipments.map(item => {
    return set(item, MODE_FIELD, Mode.show);
  }) as EditableRelatedEquipment[];
  if (newRelatedEquipment) {
    relatedEquipmentsList.push(newRelatedEquipment as EditableRelatedEquipment);
  }

  const handleConfirm = isInAddingMode
    ? submitForm
    : undefined;

  const schema = buildSchema({
    relatedEquipments: relatedEquipmentsList,
    statuses,
    primaryOwners: companyMine.employees ?? [],
    locations: companySettings?.equipmentFamily?.locations ?? [],
    actionsClass: classes.actionsCell,
    onConfirm: handleConfirm,
    onDiscard: discardRelatedEquipments,
  });

  const handleItemChange: GridProps<EditableRelatedEquipment>['onItemChange'] = ({ field, value }) => {
    if (!newRelatedEquipment || !field) {
      return;
    }
    setFieldValue(field, value);
    setNewRelatedEquipment((prevState) => set(prevState ?? {}, field, value));
  };

  const documentTypesAsync = useAsync<DocumentType[]>({
    onSuccess: () => {
      if (isEmpty(documentTypesByCategory)) {
        toastError(translate('missing.type.error'));
        return;
      }
      setRelatedDocumentTypeId(undefined);
      setRelatedFormDocumentId(undefined);
      setInitialValues(SELECT_FORM_INITIAL_VALUES);
      multipleFormDialog.open();
    },
    onError: toastError,
  });

  const formIdsAsync = useAsync<DocumentTypeById>({
    onSuccess: (data) => {
      if (isEmpty(formIds)) {
        toastError(translate('missing.form.error', { name: data?.documentType?.documentTypeName }));
        return;
      }
      if (formIds.length === 1) {
        handleFormIdSelection(formIds[0].id);
      }
    },
    onError: toastError,
  });

  const handleAddNewButtonClick = () => {
    documentTypesAsync.start(getDocTypesByCategory, { category: 'Equipment' }, documentTypesAsync);
  };

  const handleAddLastButtonClick = () => {
    if (!relatedEquipmentsList?.length) {
      return handleAddNewButtonClick();
    }

    const lastRelatedEquipment = relatedEquipmentsList[relatedEquipmentsList.length - 1];

    setRelatedDocumentTypeId(lastRelatedEquipment.documentTypeId);
    setRelatedFormDocumentId(lastRelatedEquipment.formDocumentIdLastReleased);

    handleAddRelatedEquipment(lastRelatedEquipment.documentTypeId);
  };

  const multipleFormDialog = useDialog();
  const handleDocTypeSelection = (docTypeId: string) => {
    if (!docTypeId) {
      return;
    }

    setRelatedDocumentTypeId(docTypeId);
    formIdsAsync.start(getDocRevByIds, docTypeId, formIdsAsync);
  };
  const handleFormIdSelection = (formId: string) => {
    if (!formId) {
      return;
    }

    setRelatedFormDocumentId(formId);
    handleAddRelatedEquipment(relatedDocumentTypeId as string);
  };

  const closeMultipleFormDialog = () => {
    multipleFormDialog.close();
  };

  const renderFormTemplateDialog = (props: FormikProps<FormikValues>) => (
    <MultipleFormTemplateDialog
      {...props}
      dialog={multipleFormDialog}
      handleSelection={handleDocTypeSelection}
      handleTemplateSelection={handleFormIdSelection}
      areFormIdsLoading={formIdsAsync.isLoading}
      {...{
        documentTypes: documentTypesByCategory,
        formIds: relatedDocumentTypeId || documentTypesByCategory.length === 1 ? formIds : [],
        isRecord: false,
        closeMultipleFormDialog,
        isLHR: false,
      }}
    />
  );

  const isLoading = loading || documentTypesAsync.isLoading || formIdsAsync.isLoading;
  const isAddingDisabled = isInAddingMode || isLoading;
  const lastRelatedEquipment = last(relatedEquipments);
  const isAddingLastAllowed = Boolean(lastRelatedEquipment?.formDocumentIdLastReleased);

  return (
    <Box className={classes.root} data-cy="related-equipments">
      <PromptIfDirty dirty={dirty} />
      <FBSection label="form.builder.related.equipments.title" />
      <KendoDataGrid<EditableRelatedEquipment>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={relatedEquipmentsList}
        rowRender={rowRender}
        onItemChange={handleItemChange}
        loading={isLoading}
        fallback={!isActive && translate('form.builder.related.equipments.not.active.fallback')}
      />
      {isActive && (
        <ButtonGroup
          variant="outlined"
          color="secondary"
          fullWidth
          disabled={isAddingDisabled}
        >
          {isAddingLastAllowed && (
            <Button
              kind="add"
              attached
              onClick={handleAddLastButtonClick}
              data-cy="add-last-button"
            >
              {translate('form.builder.related.equipments.add.last')}
            </Button>
          )}
          <Button
            className={cx({ [classes.fitContent]: isAddingLastAllowed })}
            kind="add"
            attached
            onClick={handleAddNewButtonClick}
            data-cy="add-new-button"
          >
            {translate('form.builder.related.equipments.add.new')}
          </Button>
        </ButtonGroup>
      )}
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik initialValues={initialValues} onSubmit={emptyFunction}>
          {multipleFormDialog.isOpen && renderFormTemplateDialog}
        </Formik>
      </FormContext.Provider>
    </Box>
  );
};

export default withRelatedEquipments(RelatedEquipments);

export * from './utils';
