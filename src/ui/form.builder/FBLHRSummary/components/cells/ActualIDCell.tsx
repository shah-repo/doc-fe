import { Box, CircularProgress, TextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
import {
  MODE_FIELD,
  Mode,
} from '../../../../components/KendoDataGrid/constants';
import { FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { DocType, LHR_SUMARY_FIELDS, LIMIT, MIN_SEARCH_TERM_LENGTH } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, LHRSummaryOptionsResponse } from '../../types';
import { PreviewDoc } from './PreviewDoc';
import { styles } from './styles';

interface CustomOptionType extends OptionType{
  calDueDate: string
  pmDueDate: string
}

const Editor: React.FC<CustomTemplateProps> = ({
  dataItem,
}) => {
  const { values, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const classes = styles();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const isMaterialTypeSelected = values.type === DocType.material;
  const isEqTypeSelected = values.type === DocType.equipment;
  const [inputValue, setInputValue] = useState('');
  const [selectedObj, setSelectedObj] = useState<OptionType>();
  const [items, setItems] = useState<OptionType[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isTypeFieldEmpty = isEmpty(values.type);

  useEffect(() => {
    const actualDetails = values?.actualDetails;
    const docId = actualDetails?.docId;

    if (isEmpty(actualDetails)) {
      return;
    }

    if (!inputValue && docId) {
      setFieldValue('prevActualId', values[LHR_SUMARY_FIELDS.actualId]);
      setFieldValue('prevActualDocId', docId);
      setInputValue(docId);
    }

    if (isUpdateAction && !inputValue && !docId) {
      setInputValue(dataItem[LHR_SUMARY_FIELDS.actualId] ?? '');
    }
  }, [values?.actualDetails]);

  const fetchLHRSummaryByOptionId = useActionCreator(lhrSummaryActions.fetchLHRSummaryDataByOptionId);

  const fetchOptionsDataAsync = useAsync({
    onSuccess: (data?: LHRSummaryOptionsResponse) => {
      if (!isUpdateAction && !selectedObj?.value) {
        setFieldValue(LHR_SUMARY_FIELDS.actualId, inputValue);
      }

      const modifiedItems = data?.items?.map((item) => ({
        label: translate('lhr.summary.displayRevision',
          {
            docId: item.document?.docId,
            displayRevision: item?.displayRevision,
            name: item?.name,
          }),
        value: item.id,
        calDueDate: item.calDueDate,
        pmDueDate: item.pmDueDate,
      })) ?? [];

      if (isEmpty(inputValue)) {
        setItems(prev => [...prev, ...modifiedItems]);
      } else {
        setItems(modifiedItems);
      }
    },
  });

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string) => {
    if (isTypeFieldEmpty) {
      setFieldValue(LHR_SUMARY_FIELDS.actualId, '');
      setInputValue('');
      return;
    }

    if (!inputVal && inputValue) {
      if (isEqTypeSelected) {
        setFieldValue(LHR_SUMARY_FIELDS.calDueDate, null);
        setFieldValue(LHR_SUMARY_FIELDS.pmDueDate, null);
      } else if (isMaterialTypeSelected) {
        setFieldValue(LHR_SUMARY_FIELDS.lotOrEquipment, null);
        setFieldValue(LHR_SUMARY_FIELDS.lotStatus, '');
        setFieldValue(LHR_SUMARY_FIELDS.expiryDate, null);
      }

      setFieldValue(LHR_SUMARY_FIELDS.actualId, '');
    }

    if (inputValue === inputVal && !isEmpty(inputVal)) {
      return;
    }

    setInputValue(inputVal);

    if (fetchOptionsDataAsync.isLoading) {
      return;
    }

    if (inputVal && inputVal.length >= MIN_SEARCH_TERM_LENGTH) {
      setOffset(0);
      queryApi(0, inputVal);
    } else if (!inputVal) {
      setOffset(0);
      queryApi(0);
    }
  };

  const onChange = (event: React.ChangeEvent<{}>, value: CustomOptionType) => {
    if (isTypeFieldEmpty) {
      return;
    }

    setSelectedObj(value);

    if (isEqTypeSelected) {
      setFieldValue(LHR_SUMARY_FIELDS.calDueDate, value.calDueDate ?? null);
      setFieldValue(LHR_SUMARY_FIELDS.pmDueDate, value.pmDueDate ?? null);
    } else if (isMaterialTypeSelected) {
      setFieldValue(LHR_SUMARY_FIELDS.lotOrEquipment, null);
      setFieldValue(LHR_SUMARY_FIELDS.lotStatus, '');
      setFieldValue(LHR_SUMARY_FIELDS.expiryDate, null);
    }

    setInputValue(value?.label);
    setFieldValue(LHR_SUMARY_FIELDS.actualId, value?.value);
  };

  const debounceFunction = debounce(onInputChange, 1000, {
    leading: true,
    trailing: true,
  });

  const onScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;

    if (Math.ceil(listboxNode.scrollHeight - listboxNode.scrollTop) === listboxNode.clientHeight) {
      const nextOffset = offset + LIMIT;
      setOffset(nextOffset);
      queryApi(nextOffset, inputValue);
    }
  };

  const getOptionId = () => {
    if (isMaterialTypeSelected) {
      return FBAutocompleteAsyncOption.releasedParts;
    } else {
      return FBAutocompleteAsyncOption.equipment;
    }
  };

  const queryApi = (offset: number, searchText?: string) => {
    if (isTypeFieldEmpty) {
      return;
    }

    fetchOptionsDataAsync.start(
      fetchLHRSummaryByOptionId,
      searchText ?? '',
      getOptionId(),
      offset,
      fetchOptionsDataAsync,
    );
  };

  const handleOpen = () => {
    if (isTypeFieldEmpty) {
      toastError(translate('lhr.summary.type.empty.error.message'));
    }

    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isUpdateAction) {
      setInputValue('');
      setFieldValue(LHR_SUMARY_FIELDS.actualId, '');
    }

    if (fetchOptionsDataAsync.isLoading) {
      return;
    }

    setItems([]);
    queryApi(0);
  }, [dataItem[MODE_FIELD], values.type]);

  return (
    <FormikField name={LHR_SUMARY_FIELDS.actualId}>
      <Autocomplete
        {...{ onChange }}
        classes={{ option: classes.option }}
        key={isEmpty(items) ? 'disabled' : 'enabled'}
        value={{ label: inputValue }}
        options={items}
        getOptionLabel={(option) => option.label ?? '' }
        filterOptions={(x) => x}
        size="small"
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%" data-cy="actualId">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                disabled={isTypeFieldEmpty}
                placeholder={translate('lhr.summary.placeholder.select.enter')}
                InputProps={{
                  ...params.InputProps,
                  style: { padding: '0px 30px 0px 9px', borderRadius: 3 },
                  startAdornment: (
                    <div>
                      {params.InputProps.startAdornment}
                    </div>
                  ),
                  endAdornment: (
                    <>
                      { fetchOptionsDataAsync.isLoading && (
                        <CircularProgress color="inherit" size={16} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { padding: '4.5px 0' },
                }}
              />
            </Box>
          </Box>
        )}
        renderOption={(option) => option.label}
        onInputChange={debounceFunction}
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        disableClearable
        ListboxProps={{ onScroll }}
        loading={fetchOptionsDataAsync.isLoading}
      />
    </FormikField>
  );
};

export const ActualIDCell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  return <PreviewDoc dataItem= {dataItem} detailsObj={dataItem.actualDetails} field={LHR_SUMARY_FIELDS.actualId} onClick={onClick} />;
};
