import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { EditableAllocationItem } from '../../../interface';
import { ADD_FIELD, MODE_FIELD } from '../constants';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const IDCell: React.ComponentType<CustomTreeListCellProps> = ({ hasChildren, colSpan, id, style, dataItem, field, level, openDetailDrawer, onExpandChange, expanded, ariaColumnIndex, colIndex, className }) => {
  const isEditMode = isEditAllocItem(dataItem) && !dataItem.isDisabled;
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableAllocationItem>();
  const navigationAttributes = useTableKeyboardNavigation(id);

  const onClick = (ev) => {
    onExpandChange(ev, dataItem, level);
  };

  const [parts, setParts] = React.useState<DocumentRevision[]>([]);
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

  useEffect(() => {
    if (!isEditMode || (isEditMode && dataItem.isLotAddition) || (isEditMode && !isEmpty(dataItem.lotRevId))) {
      return;
    }

    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  }, [dataItem[MODE_FIELD], dataItem[ADD_FIELD]]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const value = renderOptions().find((option) => option.value === dataItem.partRevId);

    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [parts]);

  const renderOptions = () => {
    return parts.map((part) => ({
      label: translate('wo.displayRevision', { docId: part.document.docId, displayRevision: part?.displayRevision, name: part?.name }),
      value: part.id,
    }));
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    setValue(option as OptionType);
    setFieldValue('partRevId', option?.value);
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
      {hasChildren && !isEditMode
        && <span
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
        </span>}
      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && !dataItem.isLotAddition && !dataItem.lotRevId && <div className={classes.idCellEditWrapper}>
          { getFieldInfo()}
        </div>}
        {!isEditMode
        && (dataItem.docId) }
      </span>
    </td>
  );
};

export default memo(IDCell);
