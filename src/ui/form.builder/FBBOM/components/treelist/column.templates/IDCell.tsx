import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { Formik, FormikProps, useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import { Observer } from 'mobx-react';
import React, { ChangeEvent, ComponentType, memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SM } from '../../../../../../App';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../../../state/ducks/documentRevisions';
import { documentTypeActions, documentTypeSelectors } from '../../../../../../state/ducks/documentRevisions/documentType';
import { DocumentTypeById } from '../../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../../../state/reducers';
import AlertDialog from '../../../../../app/alert.dialog/AlertDialog';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { FormContext } from '../../../../../components/forms/FormContext';
import { toastError } from '../../../../../components/notifications';
import Text from '../../../../../components/Text';
import { isDocumentRevisionInDraft, isDocumentRevisionObsolete, isDocumentRevisionPendingChange } from '../../../../../documentRevision/helpers/documentRevisionStatus';
import MultipleFormTemplateDialog from '../../../../../documentType/dialogs/MultipleFormTemplateDialog';
import { useHandleCreateDoc } from '../../../../../documentType/list/CreateDocumentByType';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import { Colors } from '../../../../../layout/theme-next';
import { EditableBOM } from '../../../interface';
import DocumentRevisionDialog from '../../DocumentRevisionDialog';
import { ADD_FIELD, SELECTED_PART_KEY_SEPARATOR } from '../constants';
import { isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

interface MultipleFormInitialValues {
  selectType: OptionType[]
}

const IDCell: ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, openDetailDrawer, onExpandChange, expanded, ariaColumnIndex, colIndex, className }) => {
  const { _documentRevisionFormState } = SM.useStores();
  const isEditMode = isEditBOM(dataItem) && !dataItem.isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue, submitForm } = useFormikContext<EditableBOM>();
  const navigationAttributes = useTableKeyboardNavigation(id);

  const isAllowedToUpgrade = (isDocumentRevisionInDraft(_documentRevisionFormState?.documentRevision?.status)
    || isDocumentRevisionPendingChange(_documentRevisionFormState?.documentRevision?.status))
    && !dataItem.isUpgradeDisabled
    && !isDocumentRevisionObsolete(dataItem.availableRevisions?.status);

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  const [parts, setParts] = React.useState<DocumentRevision[]>([]);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });
  console.log('ID cell rendering', dataItem.docId);

  const dialog = useDialog();

  const fetchSelectedPartAsync = useAsync({
    onSuccess: (data: any[] = []) => {
      if (data && data.length > 0) {
        const {
          displayRevision, displayStatus, name, hasAttachments,
          hasPrimaryAttachment, docId, id, quantity,
        } = data[0];

        setFieldValue('displayRevision', displayRevision);
        setFieldValue('displayStatus', displayStatus);
        setFieldValue('name', name);
        setFieldValue('hasAttachments', hasAttachments);
        setFieldValue('hasPrimaryAttachment', hasPrimaryAttachment);
        setFieldValue('docId', docId);
        setFieldValue('quantity', quantity ?? 1);
        if (dialog.isOpen) {
          setFieldValue('childNodeRevId', dataItem?.id?.split(SELECTED_PART_KEY_SEPARATOR)[0]);
          setFieldValue('newChildNodeRevId', id);
          setFieldValue('quantity', dataItem?.quantity ?? 1);
          setFieldValue('unit', dataItem?.unit);
          setFieldValue('comment', dataItem?.comment);
          setFieldValue('parentNodeRevId', dataItem?.parentNodeRevId);
          dialog.close();
          submitForm();
        }
      }
    },
  });

  const onRevChange = () => {
    fetchSelectedPartAsync.start(
      fetchSelectedPartsAction,
      dataItem?.availableRevisions?.id,
      dataItem?.availableRevisions?.documentId,
      fetchSelectedPartAsync,
    );
  };

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  }, []);

  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);
  const fetchSelectedPartsAction = useActionCreator(documentRevisionsActions.fetchBOMBranch);

  const renderOptions = () => {
    return parts.map((part) => ({
      label: renderPartLabel(part),
      value: `${part.id}${SELECTED_PART_KEY_SEPARATOR}${part.document.id}`,
    }));
  };

  const renderPartLabel = (part: DocumentRevision) => {
    return `${part?.document.docId} Rev ${part?.displayRevision} - ${part?.name}`;
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    const docInfo = option?.value.split(SELECTED_PART_KEY_SEPARATOR) ?? [];
    setValue(option as OptionType);
    fetchSelectedPartAsync.start(
      fetchSelectedPartsAction,
      docInfo[0],
      docInfo[1],
      fetchSelectedPartAsync,
    );
    if (dataItem[ADD_FIELD]) {
      setFieldValue('childNodeRevId', docInfo[0]);
      setFieldValue('childNodeDocumentId', docInfo[1]);
    } else {
      setFieldValue('newChildNodeRevId', docInfo[0]);
    }
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    let fieldValue = '';
    if (!dataItem[ADD_FIELD]) {
      fieldValue = `${dataItem.id?.split(SELECTED_PART_KEY_SEPARATOR)[0]}${SELECTED_PART_KEY_SEPARATOR}${dataItem?.documentId}`;
    } else {
      const part = _documentRevisionFormState?.newlyCreatedDocumentRevision;
      if (!isEmpty(part) && showFormDialog.isOpen) {
        const {
          displayRevision, displayStatus, name,
        } = part as DocumentRevision;
        fieldValue = `${part?.id}${SELECTED_PART_KEY_SEPARATOR}${part?.document.id}`;
        setFieldValue('childNodeRevId', part?.id);
        setFieldValue('childNodeDocumentId', part?.document?.id);
        setFieldValue('displayRevision', displayRevision);
        setFieldValue('displayStatus', displayStatus);
        setFieldValue('name', name);
        setFieldValue('quantity', 1);
        setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
      }
    }
    const value = renderOptions().find((option) => option.value === fieldValue);
    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [parts]);

  const replaceDocumentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, dataItem?.replacementStatus ?? ''),
  );

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () =>
    loadDocumentRevision(dataItem?.replacementStatus, '');

  useEffect(() => {
    if (dataItem?.replacementStatus) {
      loadAction();
    }
  }, []);

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });

  const getFieldInfo = () => (
    field && <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disableOpenOnFocus={true}
        blurOnSelect
        ListboxComponent={({ children, ...otherProps }) => {
          return (<>
            <ul {...otherProps} >
              {/* <li className={classes.createPartOption} onClick={handleAddButtonClick}>
                <FontAwesomeIcon icon={regular('plus')} />&nbsp;
                <span >{translate('form.builder.create.new.part')}</span>
              </li> */}
              {children}
            </ul>
          </>);
        }}
        options={renderOptions()}
        placeholder={translate('common.select')}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );

  const openRevChangeDialog = () => { isAllowedToUpgrade && dialog.open(); };

  const getInfoIcon = () => (
    <span className={cx(classes.infoIcon, classes.defaultIcon)} onClick={openRevChangeDialog}>
      <Tooltip arrow title={translate('bom.revision.available')} placement="top-start">
        <FontAwesomeIcon data-cy="new-revision-available" color={Colors.primaryLight} className={cx(classes.defaultIcon)} icon={solid('circle-exclamation')} />
      </Tooltip>
    </span>
  );

  const [initialValues, setInitialValues] = React.useState<MultipleFormInitialValues>({ selectType: [] });
  const multipleFormDialog = useDialog();
  const showFormDialog = useDialog();
  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypesByCategory);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const formIds = useSelector(documentTypeSelectors.docRevTypeForms);
  const handleCreateDocument = useHandleCreateDoc();

  const idAsync = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (isEmpty(formIds)) {
        toastError('missing.form.error');
        return;
      }
      _documentRevisionFormState?.setShowPartInDialog(true);
      closeMultipleFormDialog();
      showFormDialog.open();
    _documentRevisionFormState?.setDirty(false);
    handleCreateDocument(formIds[0] as DocumentRevision);
    },
    onError: (msg) => toastError(msg),
  });

  useEffect(() => {
    const part = _documentRevisionFormState?.newlyCreatedDocumentRevision;
    if (!isEmpty(part) && showFormDialog.isOpen) {
      fetchAvailablePartsAsync.start(
        fetchAvailablePartsAction,
        fetchAvailablePartsAsync,
      );
    }
  }, [_documentRevisionFormState?.newlyCreatedDocumentRevision]);

  const categoryAsync = useAsync<DocumentType[]>({
    onSuccess: () => {
      if (isEmpty(documentTypes)) {
        toastError('missing.type.error');
        return;
      }
      setInitialValues({ selectType: [] });
      multipleFormDialog.open();
    },
    onError: (msg) => toastError(msg),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddButtonClick = () => {
    // commented create new part temporarily
    categoryAsync.start(getDocTypesByCategory, { category: 'Parts' }, categoryAsync);
  };

  const handleDocTypeSelection = (docTypeId) => {
    if (!docTypeId) {
      return;
    }
    idAsync.start(getDocRevByIds, docTypeId, idAsync);
  };

  const closeMultipleFormDialog = () => {
    multipleFormDialog.close();
  };

  const renderFormTemplateDialog = (props: FormikProps<any>) => (
    <MultipleFormTemplateDialog
      {...props}
      dialog={multipleFormDialog}
      handleSelection={handleDocTypeSelection}
      {...{
        documentTypes,
        formIds: [],
        isRecord: false,
        closeMultipleFormDialog,
        isLHR: false,
      }}
    />
  );

  const canAddChildren = (dataItem: EditableBOM) => {
    return dataItem.isOwner
      && !isEditMode
      && !dataItem.isDisabled
      && ![DocumentRevisionStatus.Deprecated, DocumentRevisionStatus.Voided, DocumentRevisionStatus.Obsolete,
        DocumentRevisionStatus.Released, DocumentRevisionStatus.InReview, DocumentRevisionStatus.Approved].includes(dataItem.status);
  };

  const getRevInfoIcon = (i, hasChildren, availableRevs) => {
    if (availableRevs?.isReleased && !dataItem.isDeleted) {
      return getInfoIcon();
    }
  };
  const setChildInfo = (dataItem, level) => {
    if ((!dataItem?.isMaximizedWindow && !_documentRevisionFormState?.isMaximizedView)
    || (dataItem?.isMaximizedWindow && _documentRevisionFormState?.isMaximizedView)) {
    _documentRevisionFormState?.setDirty(true);
    if (!_documentRevisionFormState?.bomChangesInProgress) {
      _documentRevisionFormState?.setChildPartInfo({ dataItem: dataItem, level });
      _documentRevisionFormState?.setBOMChangesInProgress(true);
    }
    }
  };

  const isFinalLevel = (i: number) => i === level.length - 1;
  const isPrevLevel = (i: number) => i === level.length - 2;

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={expanded}
      aria-selected="false"
      {...{ colSpan, id, style }}
      data-cy="cell-id"
    >
      {!isEditMode
        && [...(Array(level.length) as number[])].map((e, i) => {
          const availableRevs = dataItem?.availableRevisions;
          const isPrevLevelOfAvailableRevsExistsRow = isPrevLevel(i) && availableRevs?.isReleased;
          if (isFinalLevel(i)) {
            return (
              <>
                {getRevInfoIcon(i, hasChildren, availableRevs)}
                <span
                  className={cx(
                    classes.defaultIcon,
                    { [classes.expand]: hasChildren },
                    { [classes.disabled]: !hasChildren },
                  )}
                >
                  <FontAwesomeIcon
                    data-cy="minimize-row-button"
                    onClick={hasChildren ? onClick : undefined}
                    size="sm"
                    icon={
                      expanded || !hasChildren
                        ? regular('square-minus')
                        : solid('square-plus')
                    }
                  />
                </span>
              </>
            );
          }
          return (
            !isEditMode && (
              <span
                className={cx('k-icon', 'k-i-none', i, {
                  [classes.levelWidth]: !isPrevLevelOfAvailableRevsExistsRow,
                  [classes.levelWithRevIcon]: isPrevLevelOfAvailableRevsExistsRow,
                })}
                onClick={() => { isPrevLevelOfAvailableRevsExistsRow && isAllowedToUpgrade && dialog.open(); }}
                role="presentation"
              />
            )
          );
        })}

      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && <div className={classes.idCellEditWrapper}>
          { getFieldInfo()}
          {/* <Tooltip
            title={translate('form.builder.create.new.part')}
            placement="top"
            arrow
          >
            <FontAwesomeIcon onClick={handleAddButtonClick} color={Colors.primaryLight } icon={solid('octagon-plus')} className={classes.childePartAddIcon} />
          </Tooltip> */}
        </div>}
        {!isEditMode
        && (_documentRevisionFormState?.docId !== dataItem.docId
          ? <Link onClick={e => { e.preventDefault(); openDetailDrawer?.(dataItem); }} className={classes.link}
            to="#"
          >
            {dataItem.docId}
          </Link>
          : dataItem.docId) }
        {dataItem.isOwner && !isEditMode && <Tooltip
          title={translate('bom.owner')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon data-cy="owner" className={cx(classes.defaultIcon, classes.ownerIcon)} icon={solid('user-pen')} />
        </Tooltip>}
        {canAddChildren(dataItem) && <Tooltip
          title={translate('bom.add.child.part')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon data-cy="add-child-part-button" className={cx(classes.defaultIcon, classes.childePartAddIcon)} onClick={() => setChildInfo(dataItem, level)} color={Colors.primaryLight } icon={solid('octagon-plus')} />
        </Tooltip>}
        {dataItem.isDeleted && !dataItem.isDisabled && <Tooltip
          title={translate('common.restore')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon
            data-cy="field-restore"
            className={cx(classes.restoreParentIcon, classes.defaultIcon)}
            onClick={() => _documentRevisionFormState?.setRestorePartInfo({ dataItem: dataItem, level })}
            icon={solid('arrow-rotate-left')} />
        </Tooltip>}
      </span>
      <Observer>
        {() => (
          <>
            {!isEditMode && _documentRevisionFormState?.isDiffViewEnabled && dataItem?.replacementStatus
            && <Grid
              container
              className={classes.replacedDocRevInfo}
              wrap="nowrap"
              justify="flex-end"
              alignItems="center"
            >
              <span className={classes.replacedDocRevInfoTitle} >{translate('bom.replaced.doc.rev')}</span>&nbsp;
              <FontAwesomeIcon icon={solid('arrow-right')} />&nbsp;{replaceDocumentRevision?.document?.docId}
              <Grid item className={classes.whiteDot} />
              <Grid item>
                <Text
                  translation="form.builder.header.rev"
                  values={{ revision: replaceDocumentRevision?.displayRevision }}
                />
              </Grid>
            </Grid>}
          </>
        )}
      </Observer>
      <AlertDialog
        confirmAction={onRevChange}
        cancelAction={dialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.cancel"
        message="bom.revision.alert.message"
        {...{ dialog }}
      />
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik initialValues={initialValues} onSubmit={handleDocTypeSelection}>
          {renderFormTemplateDialog}
        </Formik>
      </FormContext.Provider>
      <DocumentRevisionDialog dialog={showFormDialog} />
    </td>
  );
};

export default memo(IDCell);
