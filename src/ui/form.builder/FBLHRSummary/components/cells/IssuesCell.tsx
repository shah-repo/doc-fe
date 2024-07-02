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
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { LHR_SUMARY_FIELDS, LIMIT, MIN_SEARCH_TERM_LENGTH } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, RecordsResponse } from '../../types';
import { PreviewDoc } from './PreviewDoc';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({
  dataItem,
}) => {
  const { values, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const classes = styles();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const [inputValue, setInputValue] = useState('');
  const [selectedObj, setSelectedObj] = useState<OptionType>();
  const [items, setItems] = useState<OptionType[]>([]);
  const [offset, setOffset] = React.useState(0);

  useEffect(() => {
    const issueDetails = values?.issueDetails;
    const docId = issueDetails?.docId;

    if (isEmpty(issueDetails)) {
      return;
    }

    if (isUpdateAction && !inputValue) {
      setInputValue(docId ?? dataItem[LHR_SUMARY_FIELDS.issue] ?? '');
    }
  }, [values?.issueDetails]);

  const fetchLHRSummaryByOptionId = useActionCreator(lhrSummaryActions.fetchRecords);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchOptionsDataAsync = useAsync({
    onSuccess: (data?: RecordsResponse) => {
      if (!isUpdateAction && !selectedObj?.value) {
        setFieldValue(LHR_SUMARY_FIELDS.issue, inputValue);
      }

      const modifiedItems = data?.results?.map((item) => ({
        label: translate('lhr.summary.displayRevision',
          {
            docId: item.document?.docId,
            displayRevision: item.precalc?.revision,
            name: item?.name,
          }),
        value: item.id,
      })) ?? [];

      if (isEmpty(inputValue)) {
        setItems(prev => [...prev, ...modifiedItems]);
      } else {
        setItems(modifiedItems);
      }
    },
  });

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string) => {
    setInputValue(inputVal);

    if (!isOpen) {
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

  const onChange = (event: React.ChangeEvent<{}>, value: OptionType) => {
    setSelectedObj(value);
    setInputValue(value?.label);
    setFieldValue(LHR_SUMARY_FIELDS.issue, value?.value);
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

  const queryApi = (offset: number, searchText?: string) => {
    fetchOptionsDataAsync.start(
      fetchLHRSummaryByOptionId,
      searchText ?? '',
      offset,
      fetchOptionsDataAsync,
    );
  };

  useEffect(() => {
    if (isUpdateAction) {
      return;
    } else {
      setInputValue('');
      setFieldValue(LHR_SUMARY_FIELDS.issue, '');
    }

    if (fetchOptionsDataAsync.isLoading) {
      return;
    }

    setItems([]);
    queryApi(0);
  }, [dataItem[MODE_FIELD], values.type]);

  return (
    <FormikField name={LHR_SUMARY_FIELDS.issue}>
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
            <Box width="100%" data-cy="records">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
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
        disableClearable
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        ListboxProps={{ onScroll }}
        loading={fetchOptionsDataAsync.isLoading}
      />
    </FormikField>
  );
};

export const IssuesCell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  return <PreviewDoc detailsObj= {dataItem?.issueDetails} field={LHR_SUMARY_FIELDS.issue} dataItem={dataItem} onClick={onClick} />;
};
