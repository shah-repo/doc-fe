import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect } from 'react';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { EditableBOM } from '../../../interface';
import { SELECTED_PART_KEY_SEPARATOR } from '../../treelist/constants';
import { CustomTemplateProps } from '../types';

const PartIDCell: React.FC<CustomTemplateProps> = ({ onClick, ...props }) => {
  const { dataItem, field } = props;
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const { getFieldProps, setFieldValue } = useFormikContext<EditableBOM>();

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
          revision, status, name, id,
        } = data[0];

        setFieldValue('revision', revision);
        setFieldValue('status', status);
        setFieldValue('name', name);
        setFieldValue('id', id);
      }
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
      {isAddMode && getFieldInfo()}
      {!isAddMode && <span>{dataItem[field]}</span> }
    </Box>
  );
};

export default PartIDCell;
