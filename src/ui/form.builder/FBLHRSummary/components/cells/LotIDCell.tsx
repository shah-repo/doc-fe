import { useFormikContext } from 'formik';
import { find, isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import {
  MODE_FIELD,
  Mode,
} from '../../../../components/KendoDataGrid/constants';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, LotDocument } from '../../types';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableLHRSummaryItem>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const fetchLotsByPartId = useActionCreator(documentRevisionsActions.fetchLotsByPartId);
  const { actualId } = values ?? {};
  const fetchPartLotsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (isEmpty(actualId)) {
      return;
    }

    fetchPartLotsAsync.start(fetchLotsByPartId, actualId, fetchPartLotsAsync);
  }, [values.actualId]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const renderOptions = () => {
    return lots.map((lot) => ({
      label: translate('wo.displayRevision', { docId: lot.document.docId, displayRevision: lot?.displayRevision, name: lot?.name }),
      value: lot.id,
    }));
  };

  const value = renderOptions().find((option) => option.value === values[field]);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(lots) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        freeSolo
        forcePopupIcon
        options={renderOptions()}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        placeholder={translate('lhr.summary.placeholder.select.enter')}
        size="small"
      />
    </FormikField>
  );
};

type LotIDCellProps = {lotDocs: LotDocument[]} & CustomTemplateProps;

export const LotIDCell: React.FC<LotIDCellProps> = ({
  dataItem,
  field,
  lotDocs,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [lotDocId, setLotDocId] = useState('');
  const defaultValue = dataItem[field];

  useEffect(() => {
    const lotDoc = find(lotDocs, { id: defaultValue });

    const docId = lotDoc?.docId ?? '';
    if (!isEmpty(docId)) {
      setLotDocId(docId);
    }
  }, [lotDocs, dataItem[MODE_FIELD], dataItem.lotOrEquipment]);

  if (isEditMode) {
    return (
      <Editor {...props} {...{ dataItem, field }} />
    );
  }

  return <>{lotDocId ?? defaultValue ?? EMPTY_PLACEHOLDER}</>;
};
