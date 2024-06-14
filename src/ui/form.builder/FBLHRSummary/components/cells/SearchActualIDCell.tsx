import { Box, CircularProgress, TextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
import { FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { DocType, EMPTY_PLACEHOLDER, LIMIT, MIN_SEARCH_TERM_LENGTH } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, LHRSummaryOptionsResponse } from '../../types';
import { styles } from './styles';

export const SearchActualIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const actualDocId = dataItem.actualDocId;
  const actualRevId = dataItem.actualId;
  const actualDocumentId = dataItem.actualDocumentId;

  if (isEditMode) {
    const { values, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
    const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
    const isMaterialTypeSelected = values.type === DocType.material;
    const isEqTypeSelected = values.type === DocType.equipment;
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedObj, setSelectedObj] = useState<OptionType>();
    const [items, setItems] = useState<OptionType[]>([]);
    const [offset, setOffset] = React.useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (!inputValue && values?.actualDocId) {
        setFieldValue('prevActualId', values[field]);
        setFieldValue('prevActualDocId', values?.actualDocId);
        setInputValue(values?.actualDocId);
      }

      if (isUpdateAction && !inputValue && !dataItem.actualDocId) {
        setInputValue(dataItem[field] ?? '');
      }
    }, [values?.actualDocId]);

    const fetchLHRSummaryByOptionId = useActionCreator(lhrSummaryActions.fetchLHRSummaryDataByOptionId);

    const fetchOptionsDataAsync = useAsync({
      onSuccess: (data?: LHRSummaryOptionsResponse) => {
        if (!isUpdateAction && !selectedObj?.value) {
          setFieldValue(field, inputValue);
        }

        setLoading(false);
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
      if (!inputVal && inputValue && isEqTypeSelected) {
        setFieldValue('calDueDate', null);
        setFieldValue('pmDueDate', null);
      }

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

    const onChange = (e, value) => {
      setSelectedObj(value);
      if (isEqTypeSelected) {
        setFieldValue('calDueDate', value.calDueDate ?? null);
        setFieldValue('pmDueDate', value.pmDueDate ?? null);
      }

      setInputValue(value?.label);
      setFieldValue(field, value?.value);
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
      setLoading(true);
      fetchOptionsDataAsync.start(
        fetchLHRSummaryByOptionId,
        searchText ?? '',
        getOptionId(),
        offset,
        fetchOptionsDataAsync,
      );
    };

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    useEffect(() => {
      if (isUpdateAction) {
        return;
      } else {
        setInputValue('');
        setFieldValue(field, '');
      }

      if (loading) {
        return;
      }

      setItems([]);
      queryApi(0);
    }, [dataItem[MODE_FIELD], values.type]);

    return (
      <FormikField name={field}>
        <Autocomplete
          {...{ onChange }}
          classes={{ option: classes.option }}
          key={isEmpty(items) ? 'disabled' : 'enabled'}
          value={{ label: inputValue }}
          options={items}
          getOptionLabel={(option) => option.label ?? '' }
          filterOptions={(x) => x}
          size="small"
          disabled={isUpdateAction}
          renderInput={(params: RenderInputParams) => (
            <Box display="flex">
              <Box width="100%" data-cy="actualId">
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
                        { loading && (
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
          loading={loading}
        />
      </FormikField>
    );
  }

  return (
    <>
      {actualDocumentId ? (
        <Link
          to={documentVersionPath(actualRevId, actualDocumentId)}
          target="_blank"
          id="PartOrEqDocLink-linkButton"
          className={classes.link}
        >
          {actualDocId}
        </Link>
      ) : (
        actualRevId ?? EMPTY_PLACEHOLDER
      )}
    </>
  );
};
