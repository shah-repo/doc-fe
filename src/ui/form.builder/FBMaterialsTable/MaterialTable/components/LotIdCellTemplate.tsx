import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialTreelistContext } from '..';
import { translate } from '../../../../../common/intl';
import { MomentFormats, useDate } from '../../../../../common/utils/date';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP_OPTION } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField, IconButton } from '../../../../components/forms/fields-next';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { checkIsDocumentLot } from '../../../../documentRevision/helpers/checkDocumentGroup';
import { isDocumentRevisionReleased } from '../../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useHover from '../../../../hooks/useHover';
import { DOCUMENT_REVISION_LOT_STATUS } from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.types';
import { ADD_FIELD, IS_LOT_ADDITION, MODE_FIELD } from '../constants';
import { CustomTreeListCellProps, EditableMaterial, LotOptions } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

interface LotAutocompleteProps {
  field?: string
  lots: DocumentRevision[]
  value: LotOptions
  setValue: Dispatch<SetStateAction<LotOptions>>
  dataItem: EditableMaterial
  parentPartId?: string
  lotRevId?: string
  isLoading?: boolean
}

const LotAutocomplete: React.FC<LotAutocompleteProps> = ({
  field = '',
  lots,
  value,
  setValue,
  isLoading,
  dataItem,
}) => {
  const { setFieldValue, errors, getFieldProps } = useFormikContext<EditableMaterial>();
  const { getFormattedDateString } = useDate();
  const options = useMemo(
    () =>
      lots.map((lot) => ({
        label: translate('common.select.revision', { docId: lot?.document.docId, displayRevision: lot?.displayRevision, name: lot?.name }),
        value: lot.id,
        expiryDate: lot.isExpired ? getFormattedDateString(lot.expiryDate, MomentFormats.MonthDateYearTwoDigit) : '',
        isExpired: lot.isExpired,
      })),
    [lots],
  );

  const handleChange = (_, option?: LotOptions) => {
    setValue(option ?? { label: '', value: '', documentId: '' });
    const selectedLot = lots.find((lot) => lot.id === option?.value);
    field && setFieldValue(field, option?.value);
    setFieldValue('quantityOnHand', selectedLot?.precalc?.lot_on_hand_quantity);
    setFieldValue(IS_LOT_ADDITION, true);
    setFieldValue('parentPartId', dataItem.parentPartId);
    setFieldValue('selectedLotLabel', option?.label);
    setFieldValue('parentId', dataItem.parentId);
    setFieldValue('id', dataItem.id);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  return (
    <FormikField name={field} required error={Boolean(errors[field])}>
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!!dataItem[field]}
        options={options}
        blurOnSelect
        disableOpenOnFocus
        placeholder={translate('common.select')}
        size="small"
        getOptionLabel={(opt) => opt.label}
        ListboxComponent={({ children, ...otherProps }) => {
          return (
            <>
              <ul {...otherProps}>{children}</ul>
            </>
          );
        }}
        loading={isLoading}
        onChange={handleChange}
      />
    </FormikField>
  );
};

const LotIdCellTemplate: React.FC<CustomTreeListCellProps> = (props) => {
  const { hasChildren, dataItem, field, onScanClick, isLHRProductionBuild, isEBProcedure } = props;
  const { parentPartId, lotId } = dataItem;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && (dataItem?.isLotAddition || dataItem?.lotId);
  const classes = styles({ isEditMode });
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [addBarCodeRef, isAddBarCodeRef] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const [value, setValue] = useState<LotOptions>({ label: '', value: '', documentId: '' });
  const { lhrsQuantity = 1, addLot, openQuickView, isDisabled } = React.useContext(MaterialTreelistContext);

  const isAddLotVisible = !dataItem?.isLotAddition && !dataItem?.lotId
    && dataItem?.isLotAdditionIconsShown
    && !(dataItem?.[MODE_FIELD] || dataItem?.[ADD_FIELD]);

  const lotDocId = dataItem?.lotDocId ?? value.label ?? '';
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const isValidLOT = (lot) => {
    let isAcceptedStatus = false;
    if (isEBProcedure) {
      isAcceptedStatus = true; // No constraints on Lot Status
    } else {
      isAcceptedStatus = isLHRProductionBuild
        ? lot?.lotStatus === DOCUMENT_REVISION_LOT_STATUS.ACCEPTED || lot?.lotStatus === DOCUMENT_REVISION_LOT_STATUS.USE_AS_IS
        : lot?.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.REJECTED && lot.lotStatus !== DOCUMENT_REVISION_LOT_STATUS.SCRAP;
    }

    const isZeroOnHandQuantity = parseFloat(lot?.precalc?.lot_on_hand_quantity) === 0;

    return isAcceptedStatus && !isZeroOnHandQuantity && !dataItem.childrenLotIds?.includes(lot.id);
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
    if (isEmpty(parentPartId)) {
      return;
    }

    fetchAvailablePartsAsync.start(fetchAvailablePartsAction, parentPartId, fetchAvailablePartsAsync, false);
  }, [parentPartId, dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    const value = renderOptions().find((option) => option.value === lotId);

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
          {isEditMode ? (
            <LotAutocomplete
              {...{
                field,
                lots,
                value,
                setValue,
                dataItem,
                parentPartId,
                isLoading: fetchAvailablePartsAsync.isLoading,
              }}
            />
          ) : (
            lotDocId
          )}
        </span>
        {!isEditMode && value.label && (
          <StyleTooltip title={translate('relatedParts.created.modal.quick.view')} placement="top" arrow>
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

export default LotIdCellTemplate;
