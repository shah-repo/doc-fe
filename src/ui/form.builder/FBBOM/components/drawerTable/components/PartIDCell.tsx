import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isNil } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../../../../app/alert.dialog/AlertDialog';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import { Colors } from '../../../../../layout/theme-next';
import { EditableBOM } from '../../../interface';
import { SELECTED_PART_KEY_SEPARATOR } from '../../treelist/constants';
import { AlternatePart } from '../../treelist/interface';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

const PartIDCell: React.FC<CustomTemplateProps> = ({ onClick, onRefresh, ...props }) => {
  const { dataItem, field } = props;
  const classes = styles();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const { getFieldProps, setFieldValue } = useFormikContext<EditableBOM>();

  const [parts, setParts] = React.useState<DocumentRevision[]>([]);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

  const dialog = useDialog();
  const openRevChangeDialog = (event: { stopPropagation: () => void }) => {
    dialog.open();
    event.stopPropagation();
  };

  const onRevChange = (event: { stopPropagation: () => void }) => {
    event?.stopPropagation();
    if (isNil(dataItem.availableRevisions)) {
      return;
    }
    fetchRevUpdatePartAsync.start(
      alternatePartRevUpdate,
      {
        existingAlternatePartRevId: dataItem.id,
        newAlternatePartRevId: dataItem.availableRevisions?.id,
        partRevId: dataItem.partRevId,
        basePartRevId: dataItem.basePartRevId,
      },
      fetchRevUpdatePartAsync,
    );
  };

  const getInfoIcon = () => (
    <span className={cx(classes.infoIcon, classes.defaultIcon)} onClick={openRevChangeDialog}>
      <Tooltip arrow title={translate('bom.revision.available')} placement="top-start">
        <FontAwesomeIcon data-cy="new-revision-available" color={Colors.primaryLight} className={cx(classes.defaultIcon)} icon={solid('circle-exclamation')} />
      </Tooltip>
    </span>
  );

  const fetchRevUpdatePartAsync = useAsync<AlternatePart[]>({
    onSuccess: (data) => {
      dialog.close();
      onRefresh?.();
    },
  });

  const fetchSelectedPartAsync = useAsync<AlternatePart[]>({
    onSuccess: (data) => {
      if (!Array.isArray(data) || !data.length) {
        return;
      }

      const { displayRevision, displayStatus, name, id, cost, leadTime } = data[0];

      setFieldValue('displayRevision', displayRevision);
      setFieldValue('displayStatus', displayStatus);
      setFieldValue('name', name);
      setFieldValue('id', id);
      setFieldValue('cost', cost);
      setFieldValue('leadTime', leadTime);
    },
  });

  useEffect(() => {
    if (!isAddMode) {
      return;
    }
    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  }, []);

  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);
  const fetchSelectedPartsAction = useActionCreator(documentRevisionsActions.fetchBOMBranch);
  const alternatePartRevUpdate = useActionCreator(documentRevisionsActions.alternatePartRevUpdate);

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
    fetchSelectedPartAsync.start(
      fetchSelectedPartsAction,
      docInfo[0],
      docInfo[1],
      fetchSelectedPartAsync,
    );
    if ([Mode.add].includes(dataItem[MODE_FIELD])) {
      setFieldValue('childNodeRevId', docInfo[0]);
      setFieldValue('childNodeDocumentId', docInfo[1]);
    } else {
      setFieldValue('newChildNodeRevId', docInfo[0]);
    }
  };

  useEffect(() => {
    if (!isAddMode) {
      return;
    }
    const fieldValue = `${dataItem.id}`;
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

  const onRowClick = (evt) => {
    evt.preventDefault();
    onClick?.({ dataItem });
  };

  return (
    <Box onClick={onRowClick}>
      {dataItem.availableRevisions?.isReleased && getInfoIcon()}
      {isAddMode && getFieldInfo()}
      {!isAddMode && <span>{dataItem[field]}</span> }
      <AlertDialog
        confirmAction={onRevChange}
        cancelAction={dialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.cancel"
        message="bom.revision.alert.message"
        {...{ dialog }}
      />
    </Box>
  );
};

export default PartIDCell;
