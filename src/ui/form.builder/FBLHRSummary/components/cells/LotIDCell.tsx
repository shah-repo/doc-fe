import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { EMPTY_PLACEHOLDER, LHR_SUMARY_FIELDS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { getDisplayDocument } from '../../utils';
import { styles } from './styles';

interface CustomOptionType extends OptionType {
  lotStatus: string
  expiryDate: string
}

const Editor: React.FC<CustomTemplateProps> = (props) => {
  const { values, setFieldValue, getFieldProps, setValues }
    = useFormikContext<EditableLHRSummaryItem>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
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
    if (isEmpty(actualId)) {
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
      label: translate('wo.displayRevision', {
        docId: lot.document.docId,
        displayRevision: lot?.displayRevision,
        name: lot?.name,
      }),
      lotStatus: lot?.lotStatus,
      expiryDate: lot?.formInput?.lot_expiry_date,
      value: lot.id,
    }));
  };

  const defaultValue = values[LHR_SUMARY_FIELDS.lotOrEquipment] ?? '';
  const value = renderOptions().find(
    (option) => option.value === defaultValue,
  ) ?? { label: defaultValue, value: defaultValue };

  const onInputChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
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
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const { docId, documentId, displayRevision, value } = dataItem?.lotOrEquipmentDetails ?? {};
  const classes = styles();

  if (isEditMode) {
    return <Editor {...props} {...{ dataItem }} />;
  }

  if (value && documentId) {
    return <Link
      to={documentVersionPath(value, documentId)}
      target="_blank"
      data-cy="lot-id"
      className={classes.link}
    >
      {getDisplayDocument(docId, displayRevision)}
    </Link>;
  }

  return <>{value ?? EMPTY_PLACEHOLDER}</>;
};
