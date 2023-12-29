import { light, regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@material-ui/core';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
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

const LotAllocatedCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, onExpandChange, addLot, expanded, ariaColumnIndex, colIndex, className, docRevId = '79670f2b-fc0d-4d0e-a84c-46fb48ca0e00' }) => {
  const isEditMode = isEditAllocItem(dataItem) && !dataItem.isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const navigationAttributes = useTableKeyboardNavigation(id);
  const [removeLotRef, isRemoveLotHovered] = useHover<HTMLButtonElement>();
  const [addLotRef, isAddLotHovered] = useHover<HTMLButtonElement>();
  const [viewLotRef, isViewLotHovered] = useHover<HTMLButtonElement>();
  const quickViewDialog = useDialog();
  const openQuickViewDialog = () => quickViewDialog.open();

  // TODO: change below code as per LOT API
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const { getFieldProps, setFieldValue } = useFormikContext<EditableAllocationItem>();
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchLotsByPartId);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (!isEditMode && (!dataItem.isLotAddition || !dataItem.lotRevId)) {
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
      label: renderPartLabel(lot),
      value: lot.id,
    }));
  };

  const renderPartLabel = (part: DocumentRevision) => {
    return `${part?.document.docId} Rev ${part?.displayRevision} - ${part?.name}`;
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue('lotRevId', option?.value);
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

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

  const handleOpenNewTab = () => {
    // TO DO to remove hard coded docRevId later
    const path = documentVersionPath(docRevId, '75eb6d63-7e92-46ad-bbed-3dc236bf3129');
    window.open(path);
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
        ? <>
          <span
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
                data-cy="add-lot-button"
              >
                <FontAwesomeIcon
                  size="sm"
                  className={classes.addChildLotIcon}
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
        </>

        : <span className={cx(classes.nameCell, classes.titleInfoCell)}>
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
                      !isViewLotHovered
                        ? light('eye')
                        : solid('eye')
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
                  data-cy="remove-lot-button"
                >
                  <FontAwesomeIcon
                    size="sm"
                    className={classes.deleteIcon}
                    icon={
                      !isRemoveLotHovered
                        ? regular('trash-can')
                        : solid('trash-can')
                    }
                  />
                </IconButton>
              </StyleTooltip>
            </span>
          </div>)
          }
        </span>
      }
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId }} />
    </td>
  );
};

export default LotAllocatedCell;
