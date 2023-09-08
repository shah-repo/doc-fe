import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ComponentType } from 'react';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { EditableBOM } from '../../../interface';
import { ADD_FIELD } from '../constants';
import { getCellValue, isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';

const RevisionCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren, isEditMode: dataItem[ADD_FIELD] });
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem);
  const isAvailableRevsExists = isEditMode && !isEmpty(dataItem?.availableRevisions);

  const renderOptions = () => {
    return [dataItem?.revision + '', dataItem?.availableRevisions?.revision + ''];
  };
  const fetchSelectedPartsAction = useActionCreator(documentRevisionsActions.fetchBOMBranch);
  const fetchSelectedPartAsync = useAsync<DocumentRevision[]>({
    onSuccess: (data) => {
      if (!Array.isArray(data) || !data.length) {
        return;
      }

      const {
        revision, status, name, hasAttachments,
        hasPrimaryAttachment, docId, id,
      } = data[0];

      setFieldValue('revision', revision);
      setFieldValue('status', status);
      setFieldValue('name', name);
      setFieldValue('hasAttachments', hasAttachments);
      setFieldValue('hasPrimaryAttachment', hasPrimaryAttachment);
      setFieldValue('docId', docId);
      setFieldValue('newChildNodeRevId', id);
    },
  });

  const onRevChange = (evt) => {
    setFieldValue('revision', evt.target.innerHTML);
    fetchSelectedPartAsync.start(
      fetchSelectedPartsAction,
      dataItem?.availableRevisions?.id,
      dataItem?.availableRevisions?.documentId,
      fetchSelectedPartAsync,
    );
  };

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          options={renderOptions()}
          value={String(values[field])}
          disabled={dataItem[ADD_FIELD]}
          onChange={onRevChange}
          size="small"
        />
      </FormikField>
    );
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx('k-table-td', className, classes.cellborderBottom)}
      {...{
        'aria-colindex': otherProps.ariaColumnIndex,
        'data-grid-col-index': otherProps.colIndex,
        'aria-expanded': otherProps.expanded,
      }}
    >
      {isAvailableRevsExists && getFieldInfo()}
      {!isAvailableRevsExists && (
        <span className={classes.Cell}>
          {getCellValue(isEditMode ? values : dataItem, field)}
        </span>
      )}
    </td>
  );
};

export default RevisionCell;
