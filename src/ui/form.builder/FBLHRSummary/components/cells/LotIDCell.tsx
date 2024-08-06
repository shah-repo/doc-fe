import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { translate } from '../../../../../common/intl';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
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
import { FB } from '../../../helpers';
import { LHR_SUMARY_FIELDS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { PreviewDoc } from './PreviewDoc';

interface CustomOptionType extends OptionType {
  lotStatus: string
  expiryDate: string
  documentId?: string
}

const Editor: React.FC<CustomTemplateProps> = (props) => {
  const { values, setFieldValue, getFieldProps, setValues }
    = useFormikContext<EditableLHRSummaryItem>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const fetchLotsByPartId = useActionCreator(
    lhrSummaryActions.fetchLotsByPartId,
  );
  const { actualId } = values ?? {};

  const fetchPartLotsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  useEffect(() => {
    if (!FB.isUUID(actualId)) {
      return;
    }

    fetchPartLotsAsync.start(
      fetchLotsByPartId,
      values?.actualId,
      fetchPartLotsAsync,
    );
  }, [values.actualId]);

  const handleChange = (event: ChangeEvent<{}>, value?: CustomOptionType) => {
    setValues({
      ...values,
      lotStatus: value?.lotStatus ?? '',
      expiryDate: value?.expiryDate ?? null,
      lotOrEquipment: value?.value,
    });
  };

  const renderOptions = (): CustomOptionType[] => {
    return lots.map((lot) => ({
      label: translate('lhr.summary.displayRevision', {
        docId: lot.document.docId,
        displayRevision: lot?.displayRevision,
        name: lot?.name,
      }),
      lotStatus: lot?.lotStatus,
      expiryDate: lot?.formInput?.lot_expiry_date,
      value: lot.id,
      documentId: lot?.documentId,
    }));
  };

  const defaultValue = values[LHR_SUMARY_FIELDS.lotOrEquipment] ?? '';
  const documentId = values?.lotOrEquipmentDetails?.documentId ?? '';
  const value = FB.isUUID(defaultValue) ? renderOptions().find(
    (option) => option.value === defaultValue || option?.documentId === documentId,
  ) : { label: defaultValue, value: defaultValue };

  const onInputChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
      setInputValue(value);
      setFieldValue(LHR_SUMARY_FIELDS.lotStatus, '');
      setFieldValue(LHR_SUMARY_FIELDS.expiryDate, null);
      setFieldValue(LHR_SUMARY_FIELDS.lotOrEquipment, value);
    }
  };

  return (
    <FormikField name={LHR_SUMARY_FIELDS.lotOrEquipment}>
      <Autocomplete
        {...getFieldProps(LHR_SUMARY_FIELDS.lotOrEquipment)}
        key={isEmpty(lots) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        freeSolo
        forcePopupIcon
        options={renderOptions()}
        filterOptions= {(options) => options.filter(opt => opt.label.includes(inputValue))}
        onInputChange={onInputChange}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        placeholder={translate('lhr.summary.placeholder.select.enter')}
        size="small"
      />
    </FormikField>
  );
};

export const LotIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  onClick,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} {...{ dataItem }} />;
  }

  return <PreviewDoc detailsObj= {dataItem?.lotOrEquipmentDetails} field={LHR_SUMARY_FIELDS.lotOrEquipment} dataItem={dataItem} onClick={onClick} />;
};
