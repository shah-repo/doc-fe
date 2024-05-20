import { useFormikContext } from 'formik';
import { find, isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
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
  Mode, MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { styles } from './styles';

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

    // Fetching LOTs based on actual ID
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

type LotIDCellProps = {lotDocs: DocumentRevision[]} & CustomTemplateProps;

export const LotIDCell: React.FC<LotIDCellProps> = ({
  dataItem,
  field,
  lotDocs,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [documentRevision, setDocumentRevision] = useState<DocumentRevision>();
  const defaultValue = dataItem[field];
  const classes = styles();

  useEffect(() => {
    const lotDoc = find(lotDocs, { id: defaultValue });

    if (!isEmpty(lotDoc)) {
      setDocumentRevision(lotDoc);
    }
  }, [lotDocs, dataItem[MODE_FIELD], dataItem.lotOrEquipment]);

  if (isEditMode) {
    return (
      <Editor {...props} {...{ dataItem, field }} />
    );
  }

  return (<>
    {!isEmpty(documentRevision) ? <Link
      to={documentVersionPath(documentRevision?.id as string, documentRevision?.document?.id as string)}
      target="_blank"
      id="LotDocLink-linkButton"
      className={classes.link}
    >{documentRevision?.document.docId } </Link>
      : defaultValue ?? EMPTY_PLACEHOLDER}
  </>);
};
