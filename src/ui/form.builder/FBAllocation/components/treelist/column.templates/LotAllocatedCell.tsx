import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@material-ui/core';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import DocumentRevisionDialog from '../../../../../components/common/dialogs/DocumentRevisionDialog';
import { Autocomplete, FormikField, IconButton } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import { documentVersionPath } from '../../../../../document.revision/utils/paths';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import useHover from '../../../../../hooks/useHover';
import { EditableAllocationItem } from '../../../interface';
import { ADD_FIELD, MODE_FIELD } from '../constants';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const LotAllocatedCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, woRevId, onExpandChange, addLot, expanded, ariaColumnIndex, colIndex, className, deleteLot }) => {
  const isEditMode = isEditAllocItem(dataItem) && !dataItem.isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const navigationAttributes = useTableKeyboardNavigation(id);
  const [removeLotRef, isRemoveLotHovered] = useHover<HTMLButtonElement>();
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const quickViewDialog = useDialog();
  const openQuickViewDialog = () => quickViewDialog.open();

  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const { getFieldProps, setFieldValue, errors } = useFormikContext<EditableAllocationItem>();
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    if (isEditMode && isEmpty(dataItem.parentPartRevId) && !dataItem.isLotAddition) {
      return;
    }

    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      dataItem.parentPartRevId,
      fetchAvailablePartsAsync,
    );
  }, [dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const value = renderOptions().find((option) => option.value === dataItem.lotRevId);

    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [lots]);

  const renderOptions = () => {
    return lots.map((lot) => ({
      label: translate('wo.displayRevision', { docId: lot.document.docId, displayRevision: lot?.displayRevision, name: lot?.name }),
      value: lot.id,
    }));
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    const selectedLOT = lots.find((lot) => lot.id === option?.value);
    setFieldValue('lotRevId', option?.value);
    field && setFieldValue(field, option?.value);
    setFieldValue('quantityOnHand', selectedLOT?.precalc?.lot_on_hand_quantity);
    setFieldValue('parentPartRevId', dataItem.parentPartRevId);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const [value, setValue] = useState<OptionType>({ label: '', value: '' });

  const getFieldInfo = () => (
    field && <FormikField
      name={field}
      required
      error={Boolean(errors[field])}
    >
      <Autocomplete
        {...getFieldProps(field)}
        value={value}
        disabled={!isEmpty(dataItem.lotRevId)}
        disableOpenOnFocus={true}
        blurOnSelect
        ListboxComponent={({ children, ...otherProps }) => {
          return (<ul {...otherProps} >
            {children}
          </ul>);
        }}
        options={renderOptions()}
        placeholder={translate('common.select')}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );

  const handleOpenNewTab = () => {
    if (dataItem.lotRevId && dataItem.lotDocumentId) {
      const path = documentVersionPath(dataItem.lotRevId, dataItem.lotDocumentId);
      window.open(path);
    }
  };

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
      data-cy="cell-lot-allocated"
    >
      {hasChildren || (!isEditMode && !dataItem.isLotAddition && !dataItem.lotRevId)
        ? <span
          className={cx(
            classes.defaultIcon,
          )}
        >
          <StyleTooltip
            title={translate('common.add')}
            placement="top"
            arrow
          >
            <IconButton
              kind="simple"
              size="small"
              ref={addLotRef}
              disabled={dataItem.isDisabled}
              data-cy="add-lot-button"
            >
              <FontAwesomeIcon
                size="sm"
                className={cx(classes.addChildLotIcon, { [classes.disabled]: dataItem.isDisabled })}
                onClick={() => addLot?.(dataItem)}
                icon={
                  !isAddLotHovered
                    ? regular('circle-plus')
                    : solid('circle-plus')
                }
              />
            </IconButton>
          </StyleTooltip>
        </span>
        : <span className={cx(classes.lotNameCell, classes.titleInfoCell)}>
          {isEditMode && (dataItem.isLotAddition || dataItem.lotRevId) && <div className={classes.idCellEditWrapper}>
            { getFieldInfo()}
          </div>}
          {!isEditMode && (dataItem.isLotAddition || dataItem.lotRevId) && (<div className={classes.lotInfoWrapper}>
            <span className={classes.lotInfoId}>
              <Link onClick={handleOpenNewTab} className={classes.link}>
                {dataItem.lotDocId}
              </Link>
            </span>
            <span
              className={cx(
                classes.defaultIcon,
              )}
            >
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
                >
                  <FontAwesomeIcon
                    size="sm"
                    className={classes.viewIcon}
                    icon={
                      isViewLotHovered
                        ? solid('eye')
                        : light('eye')
                    }
                    onClick={openQuickViewDialog}
                  />
                </IconButton>
              </StyleTooltip>
              <StyleTooltip
                title={translate('common.delete')}
                placement="top"
                arrow
              >
                <IconButton
                  kind="simple"
                  size="small"
                  ref={removeLotRef}
                  disabled={dataItem.isDisabled}
                  data-cy="remove-lot-button"
                >
                  <FontAwesomeIcon
                    size="sm"
                    className={cx(classes.deleteIcon, { [classes.disabled]: dataItem.isDisabled })}
                    icon={
                      isRemoveLotHovered
                        ? solid('trash-can')
                        : regular('trash-can')
                    }
                    onClick={() => deleteLot?.(dataItem)}
                  />
                </IconButton>
              </StyleTooltip>
            </span>
          </div>)
          }
        </span>
      }
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: dataItem.lotRevId, woRevId }} />
    </td>
  );
};

export default LotAllocatedCell;
