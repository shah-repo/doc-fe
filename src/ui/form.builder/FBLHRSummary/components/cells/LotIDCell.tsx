import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
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
import { styles } from './styles';

interface CustomOptionType extends OptionType {
  status: string
  expiryDate: string
}

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  const { values, setFieldValue, getFieldProps }
    = useFormikContext<EditableLHRSummaryItem>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const fetchLotsByPartId = useActionCreator(
    documentRevisionsActions.fetchLotsByPartId,
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
    setFieldValue(LHR_SUMARY_FIELDS.status, value?.status);
    setFieldValue(LHR_SUMARY_FIELDS.expiryDate, value?.expiryDate);
    setFieldValue(field, value?.value);
  };

  const renderOptions = (): CustomOptionType[] => {
    return lots.map((lot) => ({
      label: translate('wo.displayRevision', {
        docId: lot.document.docId,
        displayRevision: lot?.displayRevision,
        name: lot?.name,
      }),
      status: lot?.lotStatus,
      expiryDate: lot?.formInput?.lot_expiry_date,
      value: lot.id,
    }));
  };

  const defaultValue = values[field] ?? '';
  const value = renderOptions().find(
    (option) => option.value === defaultValue,
  ) ?? { label: defaultValue, value: defaultValue };

  const onInputChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
      setFieldValue(LHR_SUMARY_FIELDS.status, '');
      setFieldValue(LHR_SUMARY_FIELDS.expiryDate, null);
      setFieldValue(field, value);
    }
  };

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
  field,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const {
    lotOrEqDocumentId: lotDocumentId,
    lotOrEquipment: lotRevId,
    lotOrEqDocId: lotDocId,
  } = dataItem;

  const classes = styles();

  if (isEditMode) {
    return <Editor {...props} {...{ dataItem, field }} />;
  }

  if (lotRevId && lotDocumentId) {
    return <Link
      to={documentVersionPath(lotRevId, lotDocumentId)}
      target="_blank"
      data-cy="lot-id"
      className={classes.link}
    >
      {lotDocId}
    </Link>;
  }

  return <>{lotRevId ?? EMPTY_PLACEHOLDER}</>;
};
