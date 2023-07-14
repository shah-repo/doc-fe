import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, ComponentType, useEffect, useState } from 'react';
import { ReactComponent as CollapseIcon } from '../../../../../../assets/images/collapse_tree.svg';
import { ReactComponent as ExpandIcon } from '../../../../../../assets/images/expand_tree.svg';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { EditableBOM } from '../../../interface';
import { SELECTED_PART_KEY_SEPARATOR } from '../constants';
import { isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const IDCell: ComponentType<CustomTreeListCellProps> = ({ hasChildren, ...props }) => {
  const { colSpan, id, style, dataItem, field } = props;
  const isEditMode = isEditBOM(dataItem);
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableBOM>();
  const navigationAttributes = useTableKeyboardNavigation(props.id);
  const onClick = (ev) => {
    props.onExpandChange(ev, dataItem, props.level);
  };

  const [parts, setParts] = useState<DocumentRevision[]>([]);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      console.log('parts ::', data);
      setParts(data.filter(part => part.status === DocumentRevisionStatus.Released));
    },
  });

  // const fetchSelectedPartAsync = useAsync({
  //   onSuccess: (data: DocumentRevision[] = []) => {
  //     console.log('parts ::', data);
  //     field && setFieldValue(field, value?.value);
  //     // settings up other fields
  //     if (value?.value) {
  //       dataItem.docId = value.value;
  //     }
  //     dataItem.displayStatus = 'Released';
  //     setFieldValue('displayRevision', '1');
  //     setFieldValue('displayStatus', 'Released');
  //     setFieldValue('title', 'Part Document');
  //     setFieldValue('cost', '400');
  //     setFieldValue('leadTime', '2');
  //     setFieldValue('quantity', '100');
  //     setFieldValue('unit', '600');
  //     setFieldValue('refDesignator', 'Desig');
  //     setFieldValue('comments', 'Sample Comments');
  //     setFieldValue('displayStatus', 'Released');
  //   },
  // });

  useEffect(() => {
    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  }, []);

  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);
  // const fetchSelectedPartsAction = useActionCreator(documentRevisionsActions.fetchSelectedPart);

  const renderOptions = () => {
    return parts.map((part) => ({
      label: renderPartLabel(part),
      value: `${part.id}${SELECTED_PART_KEY_SEPARATOR}${part.document.id}`,
    }));
  };

  const renderPartLabel = (part: DocumentRevision) => {
    return `${part?.document.docId} Rev ${part?.displayRevision} - ${part?.name}`;
  };

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    // Trigger API Here
    // const docInfo = value?.value.split(SELECTED_PART_KEY_SEPARATOR) ?? [];

    // fetchSelectedPartAsync.start(
    //   fetchSelectedPartsAction,
    //   docInfo[0],
    //   docInfo[1],
    //   fetchSelectedPartAsync,
    // );

    field && setFieldValue(field, value?.value);
    // settings up other fields
    if (value?.value) {
      dataItem.docId = value.value;
    }
    dataItem.displayStatus = 'Released';
    setFieldValue('displayRevision', '1');
    setFieldValue('displayStatus', 'Released');
    setFieldValue('title', 'Part Document');
    setFieldValue('cost', '400');
    setFieldValue('leadTime', '2');
    setFieldValue('quantity', '100');
    setFieldValue('unit', '600');
    setFieldValue('refDesignator', 'Desig');
    setFieldValue('comments', 'Sample Comments');
    setFieldValue('displayStatus', 'Released');
  };

  const defaultValue = dataItem.id;
  const value = parts.find((part) => part.id === defaultValue);

  const getFieldInfo = () => (
    field && <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        options={renderOptions()}
        placeholder={translate('common.select')}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, props.className)}
      aria-colindex={props.ariaColumnIndex}
      data-grid-col-index={props.colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={props.expanded}
      aria-selected="false"
      {...{ colSpan, id, style }}
    >
      {!isEditMode && [...(Array(props.level.length - 1) as number[])].map((e, i) => (
        !isEditMode && <span className="k-icon k-i-none" role="presentation" />
      ))}

      {!isEditMode && <span className="k-icon">
        {hasChildren && (props.expanded
          ? <CollapseIcon
            onClick={onClick}
            data-prevent-selection="true"
            role="presentation"
          />
          : <ExpandIcon
            onClick={onClick}
            data-prevent-selection="true"
            role="presentation"
          />)
        }
      </span>}

      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && getFieldInfo()}
        {!isEditMode && dataItem.docId}
      </span>
    </td>
  );
};

export default IDCell;
