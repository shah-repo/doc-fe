import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, ComponentType, useEffect } from 'react';
import { ReactComponent as CollapseIcon } from '../../../../../../assets/images/collapse_tree.svg';
import { ReactComponent as ExpandIcon } from '../../../../../../assets/images/expand_tree.svg';
import { ReactComponent as InfoIcon } from '../../../../../../assets/images/info_icon.svg';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { ADD_FIELD } from '../../../constants';
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

  const [parts, setParts] = React.useState<DocumentRevision[]>([]);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

  const fetchSelectedPartAsync = useAsync({
    onSuccess: (data: any[] = []) => {
      if (data && data.length > 0) {
        const {
          revision, status, name, hasAttachments,
          hasPrimaryAttachment, docId,
        } = data[0];

        setFieldValue('revision', revision);
        setFieldValue('status', status);
        setFieldValue('name', name);
        setFieldValue('hasAttachments', hasAttachments);
        setFieldValue('hasPrimaryAttachment', hasPrimaryAttachment);
        setFieldValue('docId', docId);
      }
    },
  });

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

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    const docInfo = value?.value.split(SELECTED_PART_KEY_SEPARATOR) ?? [];
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
    const fieldValue = `${dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0]}${SELECTED_PART_KEY_SEPARATOR}${dataItem.documentId}`;
    const value = renderOptions().find((option) => option.value === fieldValue);
    if (value) {
      setFieldValue(field, value);
    }
  }, [parts]);

  const getFieldInfo = () => (
    field && <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        options={renderOptions()}
        placeholder={translate('common.select')}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );

  const getInfoIcon = () => (
    <span className={cx('k-icon', classes.infoIcon)}>
      <Tooltip arrow title={translate('bom.revision.available')} placement="top-start">
        <InfoIcon />
      </Tooltip>
    </span>
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
      {!isEditMode && [...(Array(props.level.length) as number[])].map((e, i) => {
        if (hasChildren) {
          if (i === props.level.length - 2 && !isEmpty(dataItem?.availableRevisions)) {
            return getInfoIcon();
          }
        } else {
          if (i === props.level.length - 1 && !isEmpty(dataItem?.availableRevisions)) {
            return getInfoIcon();
          }
        }
        if (i === props.level.length - 1 && hasChildren) {
          return (<span className={cx('k-icon', classes.expand)}>
            {(props.expanded
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
          </span>);
        }
        return !isEditMode && <span className="k-icon k-i-none" role="presentation" />;
      })
      }

      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && getFieldInfo()}
        {!isEditMode && dataItem.docId}
        {dataItem.isOwner && !isEditMode && <FontAwesomeIcon className={classes.ownerIcon} icon={solid('user-pen')} />}
      </span>
    </td>
  );
};

export default IDCell;
