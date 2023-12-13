import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect } from 'react';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { Mode, MODE_FIELD } from '../constants';
import { CustomTemplateProps, EditableLHRTableItem, ILHRAutocompleteOption, ILHRTableItem } from '../types';

export const LhrDetailsCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const { getFieldProps, setFieldValue } = useFormikContext<EditableLHRTableItem>();

  const [lhrList, setLhrList] = React.useState<ILHRAutocompleteOption[]>([]);

  const fetchAvailableLhrsAsync = useAsync({
    onSuccess: (data: ILHRAutocompleteOption[] = []) => {
      setLhrList(data);
    },
  });

  const fetchSelectedLhrAsync = useAsync<ILHRTableItem>({
    onSuccess: (data) => {
      console.log(data);
      const {
        lotId, displayStatus, owner, partRev, completionDate, startQuantity,
        endQuantity, lhrTemplate, lhrDetails,
      } = data as ILHRTableItem;

      console.log(lotId, displayStatus, owner, partRev, completionDate, startQuantity,
        endQuantity, lhrTemplate, lhrDetails);

      setFieldValue('displayStatus', displayStatus);
      setFieldValue('owner', owner);
      setFieldValue('partRev', partRev);
      setFieldValue('completionDate', completionDate);
      setFieldValue('startQuantity', startQuantity);
      setFieldValue('endQuantity', endQuantity);
      setFieldValue('lhrTemplate', lhrTemplate);
      setFieldValue('lhrDetails', lhrDetails);
      setFieldValue('lotId', lotId);
    },
  });

  useEffect(() => {
    if (!isAddMode) {
      return;
    }
    fetchAvailableLhrsAsync.start(
      fetchAvailableLhrsAction,
      fetchAvailableLhrsAsync,
    );
  }, []);

  const fetchAvailableLhrsAction = useActionCreator(documentRevisionsActions.fetchAvailableLHRs);
  const fetchLhrsDetailsAction = useActionCreator(documentRevisionsActions.fetchSelectedLHR);

  const renderOptions = () => {
    return lhrList.map((lhr) => ({
      label: renderLhrLabel(lhr),
      value: lhr.id,
    }));
  };

  const renderLhrLabel = (lhr: ILHRAutocompleteOption) => {
    return `${lhr.docId} - Rev ${lhr.displayRevision} - ${lhr.lotId}`;
  };

  const handleChange = (event: ChangeEvent<unknown>, option?: OptionType) => {
    const lhrsId = option?.value;
    fetchSelectedLhrAsync.start(fetchLhrsDetailsAction, lhrsId, fetchSelectedLhrAsync);
  };

  useEffect(() => {
    if (!isAddMode) {
      return;
    }
    const fieldValue = `${dataItem.lotId}`;
    const value = renderOptions().find((option) => option.value === fieldValue);
    if (value) {
      setFieldValue(field, value);
    }
  }, [lhrList]);

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
