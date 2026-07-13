import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { cloneDeep, debounce, endsWith, isEmpty, toUpper } from 'lodash';
import { reaction } from 'mobx';
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MaterialTreelistContext } from '..';
import { translate } from '../../../../../common/intl';
import { MomentFormats, useDate } from '../../../../../common/utils/date';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP_OPTION } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField, IconButton } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { checkIsDocumentLot } from '../../../../documentRevision/helpers/checkDocumentGroup';
import { isDocumentRevisionReleased } from '../../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useHover from '../../../../hooks/useHover';
import { Colors } from '../../../../layout/theme-next';
import { LotAutoCompleteOptions } from '../../../FBAllocation/components/treelist/column.templates/types';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { DOCUMENT_REVISION_LOT_STATUS } from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.types';
import FB from '../../../helpers/FB';
import { ADD_FIELD, IS_LOT_ADDITION, MIN_SEARCH_TERM_LENGTH, MODE_FIELD } from '../constants';
import { CustomTreeListCellProps, EditableMaterial, LotOptions } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';
import { isDateExpired } from './utils';

interface LotAutocompleteProps {
  field?: string
  lots: DocumentRevision[]
  value: LotOptions
  setValue: Dispatch<SetStateAction<LotOptions>>
  dataItem: EditableMaterial
  parentPartId?: string
  lotRevId?: string
  isLoading?: boolean
  isEBProcedure?: boolean
}

const LotPreviewCell: React.FC<CustomTreeListCellProps> = (props) => {
  const classes = styles({ isEditMode: false });
  const { dataItem } = props;
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const { openQuickView } = useContext(MaterialTreelistContext);
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(
    FBAutocompleteAsyncState,
    {},
  );

  const lotId = useMemo(
    () => dataItem?.lotId ?? '',
    [dataItem?.lotId],
  );

  const storedLot = useMemo(() => {
    if (!lotId || !FB.isUUID(lotId)) return null;

    return FBAutocompleteAsyncStore.getValue<DocumentRevision>(
      FBAutocompleteAsyncOption.ebLots,
      lotId,
    );
  }, [lotId]);

  const [lotDocId, setLotDocId] = useState('');

  useEffect(() => {
    if (!lotId || storedLot || !FB.isUUID(lotId)) return;

    autocompleteAsyncState.fetchAutocompleteOption(
      lotId,
      FBAutocompleteAsyncOption.ebLots,
    );
  }, [lotId, storedLot, autocompleteAsyncState]);

  useEffect(() => {
    if (!isEmpty(lotId) && !FB.isUUID(lotId)) {
      setLotDocId(lotId);
      return;
    }

    if (!storedLot) return;

    setLotDocId(storedLot.document.docId);
  }, [storedLot]);

  useEffect(
    () =>
      reaction(
        () => autocompleteAsyncState?.autocompleteValueApi?.data,
        (data) => {
          if (!data) return;

          setLotDocId(data.document.docId);
        },
      ),
    [],
  );

  return (
    <TreeListCellWrapper {...props}>
      <span className={cx(classes.lotNameCell, classes.titleInfoCell)}>
        <span className={cx(classes.lotInfoId, classes.normalText)} data-cy={`lot-${lotDocId}`}>
          {lotDocId}
        </span>

        {lotDocId && FB.isUUID(lotId) && (
          <StyleTooltip
            title={translate('relatedParts.created.modal.quick.view')}
            placement="top"
            arrow
          >
            <IconButton
              kind="simple"
              size="small"
              ref={viewLotRef}
              data-cy="view-lot-button"
              onClick={(event) => openQuickView?.(event, dataItem)}
            >
              <FontAwesomeIcon
                size="sm"
                className={classes.viewIcon}
                icon={isViewLotHovered ? solid('eye') : light('eye')}
              />
            </IconButton>
          </StyleTooltip>
        )}
      </span>
    </TreeListCellWrapper>
  );
};

const LotAutocomplete: React.FC<LotAutocompleteProps> = ({
  field = '',
  lots,
  value,
  setValue,
  isLoading,
  isEBProcedure,
  dataItem,
}) => {
  const { setFieldValue, errors, getFieldProps, values } = useFormikContext<EditableMaterial>();
  const { getFormattedDateString, timezone } = useDate();
  const options = useMemo(
    () =>
      lots.map((lot) => {
        const { id, document, displayRevision, name, formInput } = lot;
        const expiryDate = formInput?.lot_expiry_date;
        const isLotExpired = isDateExpired(expiryDate, timezone);
        return {
          label: translate('common.select.revision', { docId: document.docId, displayRevision, name }),
          value: id,
          expiryDate: isLotExpired ? getFormattedDateString(expiryDate, MomentFormats.MonthDateYearTwoDigit) : '',
          isExpired: isLotExpired,
        };
      }),
    [lots],
  );

  const [open, setOpen] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<OptionType[] | undefined>([]);
  const [inputValue, setInputValue] = React.useState<string>();
  const isUpdateAction = dataItem[MODE_FIELD];
  const isFreeSolo = isEBProcedure;

  useEffect(() => {
    setItems(options);
  }, [options]);

  const handleChange = (_, option?: LotOptions) => {
    setValue(option ?? { label: '', value: '', documentId: '' });
    setInputValue(undefined);
    const selectedLot = lots.find((lot) => lot.id === option?.value);
    field && setFieldValue(field, option?.value ?? '');
    setFieldValue('quantityOnHand', selectedLot?.precalc?.lot_on_hand_quantity);
    setFieldValue(IS_LOT_ADDITION, true);
    setFieldValue('parentPartId', dataItem.parentPartId);
    setFieldValue('selectedLotLabel', option?.label);
    setFieldValue('parentId', dataItem.parentId);
    setFieldValue('id', dataItem.id);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  useEffect(() => {
    const lotId = cloneDeep(values?.[field]) ?? dataItem[field ?? ''];

    if (isEBProcedure && inputValue) {
      setFieldValue(field, inputValue);
      setFieldValue(IS_LOT_ADDITION, true);
      setFieldValue('parentPartId', dataItem?.parentPartId);
      setFieldValue('selectedLotLabel', inputValue);
      setFieldValue('parentId', dataItem?.parentId);
      setFieldValue('id', dataItem.id);
      setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
      return;
    }

    if (isUpdateAction && !values?.[field] && lotId) {
      setFieldValue(field, lotId);
    }

    if (!isUpdateAction || FB.isUUID(lotId ?? '')) {
      return;
    }

    if (!isFreeSolo && !lotId) {
      setItems(options ?? []);
    }
  }, [values]);

  const onInputChange = (_: React.ChangeEvent<{}>, inputVal: string, reason: string) => {
    if (reason !== 'input') {
      return;
    }

    if (!isFreeSolo) {
      setInputValue(inputVal);
      setFieldValue(field, '');
      return;
    }

    setFieldValue(field, inputVal);
    setInputValue(inputVal);
    setValue({ label: inputVal, value: inputVal });

    if (inputVal?.length >= MIN_SEARCH_TERM_LENGTH) {
      const filteredOptions = options?.filter((option) =>
        option.label.toLowerCase().includes(inputVal?.toLowerCase()),
      );
      setItems(filteredOptions);
    } else if (!inputVal || inputVal?.length < MIN_SEARCH_TERM_LENGTH) {
      setItems(options ?? []);
    }
  };

  const debounceFunction = debounce(onInputChange, 1000, {
    leading: true,
    trailing: true,
  });

  return (
    <FormikField name={field} required error={Boolean(errors[field])}>
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!!dataItem[field] && !isEBProcedure}
        options={items}
        blurOnSelect
        {...(!open && { freeSolo: isFreeSolo })}
        onInputChange={debounceFunction}
        disableOpenOnFocus
        placeholder={translate('common.select')}
        size="small"
        open={open}
        onOpen={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(opt) => opt.label}
        renderOption={(option: LotAutoCompleteOptions, props) => (
          <ListItem {...props} className="lot-list-item" disableGutters>
            <ListItemText primary={option.label} />
            {option.isExpired && (
              <ListItemIcon>
                <StyleTooltip
                  title={translate('allocation.lot.expired.tooltip.message', { expiryDate: option.expiryDate })}
                >
                  <FontAwesomeIcon icon={regular('circle-exclamation')} color={Colors.error} size="sm" />
                </StyleTooltip>
              </ListItemIcon>
            )}
          </ListItem>
        )}
        ListboxComponent={({ children, ...otherProps }) => {
          return (
            <>
              <ul {...otherProps}>{children}</ul>
            </>
          );
        }}
        loading={isLoading}
        onChange={handleChange}
        forcePopupIcon
      />
    </FormikField>
  );
};

const LotIdCellTemplate: React.FC<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, onScanClick, isLHRProductionBuild, isEBProcedure } = props;
  const { allowExpiredLots, shouldEnforceProductionLotsOnly } = React.useContext(MaterialTreelistContext);
  const { parentPartId, lotId } = dataItem;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && (dataItem?.isLotAddition || dataItem?.lotId);
  const classes = styles({ isEditMode });
  const { timezone } = useDate();
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [addBarCodeRef, isAddBarCodeRef] = useHover<HTMLButtonElement>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const [value, setValue] = useState<LotOptions>({ label: '', value: '', documentId: '' });
  const { lhrsQuantity = 1, addLot, isDisabled } = React.useContext(MaterialTreelistContext);

  const isAddLotVisible = !dataItem?.isLotAddition && !dataItem?.lotId
    && dataItem?.isLotAdditionIconsShown
    && !(dataItem?.[MODE_FIELD] || dataItem?.[ADD_FIELD]);

  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const isValidLOT = (lot) => {
    let isAcceptedStatus = false;
    const lotOnHandQuantity = parseFloat(lot?.precalc?.lot_on_hand_quantity);
    if (isEBProcedure) {
      isAcceptedStatus = (lotOnHandQuantity > 0 || lot.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.SCRAP);
    } else {
      const isValidStatus = [
        DOCUMENT_REVISION_LOT_STATUS.ACCEPTED,
        DOCUMENT_REVISION_LOT_STATUS.USE_AS_IS,
      ].includes(lot?.lotStatus);

      isAcceptedStatus = isLHRProductionBuild ? isValidStatus
        : lot?.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.REJECTED && lot.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.SCRAP;
    }

    const isZeroOnHandQuantity = lotOnHandQuantity === 0;

    const isExpiryValid = !allowExpiredLots || !isDateExpired(lot?.formInput?.lot_expiry_date, timezone);
    const isRDDocument = endsWith(toUpper(lot?.document?.docId || ''), 'RD');
    const isLotTypeAllowed = !shouldEnforceProductionLotsOnly || !isRDDocument;

    return isLotTypeAllowed && isAcceptedStatus && isExpiryValid && !isZeroOnHandQuantity && !dataItem.childrenLotIds?.includes(lot.id);
  };

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      if (isEBProcedure) {
        setLots(data.filter(isValidLOT));
        return;
      }

      const updatedLots = data?.filter((option) => {
        const groupOptions = option.document.documentType.groupOptions;

        return (
          groupOptions?.includes(DOC_TYPE_GROUP_OPTION.TABS_PART_LOT)
          || (isDocumentRevisionReleased(option.status) && checkIsDocumentLot(groupOptions) && isValidLOT(option))
        );
      });

      setLots(updatedLots);
    },
  });

  useEffect(() => {
    if (isEmpty(parentPartId) || !isEditMode) {
      return;
    }

    fetchAvailablePartsAsync.start(fetchAvailablePartsAction, parentPartId, fetchAvailablePartsAsync, false);
  }, [parentPartId, dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    const defaultValue = lotId ?? '';
    const value = renderOptions().find((option) => option.value === defaultValue) ?? { label: defaultValue, value: defaultValue, documentId: '' };

    if (value && field) {
      setValue(value);
    }
  }, [lots]);

  const renderOptions = useCallback(() => {
    return lots.map((lot) => {
      const { id, document, documentId } = lot;
      return {
        label: document.docId,
        value: id,
        documentId: documentId,
      };
    });
  }, [lots]);

  const isLoading = fetchAvailablePartsAsync.isLoading;

  if (isAddLotVisible) {
    if (isDisabled) {
      return <TreeListCellWrapper {...props}><></> </TreeListCellWrapper>;
    }

    return (
      <TreeListCellWrapper {...props}>
        <span className={cx(classes.defaultIcon)}>
          <StyleTooltip title={translate('common.add')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={addLotRef} disabled={isDisabled} data-cy="add-lot-button">
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, { [classes.disabled]: isDisabled })}
                onClick={(event) => { event.stopPropagation(); addLot?.(dataItem); }}
                icon={isAddLotHovered ? solid('circle-plus') : regular('circle-plus')}
              />
            </IconButton>
          </StyleTooltip>
        </span>
        <span className={cx(classes.defaultIcon)}>
          <StyleTooltip title={translate('common.scan')} placement="top" arrow>
            <IconButton kind="simple" size="small" ref={addBarCodeRef} data-cy="scan-lot">
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, classes.scanIcon, { [classes.disabled]: isDisabled })}
                onClick={(event) => { event.stopPropagation(); onScanClick?.({ ...dataItem, quantity: dataItem.quantity ? dataItem.quantity * lhrsQuantity : dataItem.quantity }); }}
                icon={isAddBarCodeRef ? solid('barcode-read') : regular('barcode-read')}
              />
            </IconButton>
          </StyleTooltip>
        </span>
      </TreeListCellWrapper>
    );
  }

  if (isLoading && !isEditMode) {
    return (
      <TreeListCellWrapper {...props}>
        <CircularProgress size={16} className={classes.progress} />
      </TreeListCellWrapper>
    );
  }

  if (!isEditMode) {
    return <LotPreviewCell {...props} />;
  }

  return (
    <TreeListCellWrapper {...props}>
      <span className={cx(classes.lotNameCell, classes.titleInfoCell)}>
        <span
          className={cx({
            [classes.lotInfoId]: !isEditMode,
            [classes.boldText]: hasChildren,
            [classes.normalText]: !hasChildren,
          })}
        >
          {isEditMode && <LotAutocomplete
            {...{
              field,
              lots,
              value,
              setValue,
              dataItem,
              parentPartId,
              isEBProcedure,
              isLoading: fetchAvailablePartsAsync.isLoading,
            }}
          />
          }
        </span>
      </span>
    </TreeListCellWrapper>
  );
};

export default LotIdCellTemplate;
