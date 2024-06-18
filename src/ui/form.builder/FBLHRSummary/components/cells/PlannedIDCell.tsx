import { Box, CircularProgress, TextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce, get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FB } from '../../..';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import {
  MeqResponse,
} from '../../../../../state/ducks/documentRevisions/types';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
import {
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode, MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { DocType, EMPTY_PLACEHOLDER, LIMIT, MIN_SEARCH_TERM_LENGTH } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, LHRSummaryOptionsResponse } from '../../types';
import { styles } from './styles';

export const PlannedIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = styles();

  if (isEditMode) {
    const { values, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();
    const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedObj, setSelectedObj] = useState<OptionType>();
    const [items, setItems] = useState<OptionType[]>([]);
    const [offset, setOffset] = React.useState(0);
    const isMaterialTypeSelected = values.type === DocType.material;
    const selectedMPI = values.mpiId;
    const [isOpen, setIsOpen] = useState(false);
    const isTypeFieldEmpty = isEmpty(values.type);

    const fetchMEQByMPI = useActionCreator(
      documentRevisionsActions.fetchMaterialsOrEquipmentsBySelectedMPI,
    );

    const fetchMeqsAsync = useAsync({
      onSuccess: (data?: MeqResponse) => {
        const selectedTypeItems = isMaterialTypeSelected ? data?.materials : data?.equipment;
        if (!selectedTypeItems?.length) {
          setOffset(0);
          queryApi(0);
          return;
        }

        const items = selectedTypeItems?.map((item) => ({
          label: translate('lhr.summary.displayRevision',
            {
              docId: item?.docId,
              displayRevision: item?.revision,
              name: get(item, 'title'),
            }),
          value: get(item, 'docRevId'),
        })) ?? [];
        setItems(items);
      },
    });

    useEffect(() => {
      if (selectedMPI && FB.isUUID(selectedMPI ?? '') && values.type) {
        fetchMeqsAsync.start(fetchMEQByMPI, selectedMPI, fetchMeqsAsync);
      }
    }, [values.mpiId]);

    useEffect(() => {
      if (isUpdateAction && !inputValue && !dataItem.plannedDocId) {
        setInputValue(dataItem[field] ?? '');
      }

      if (isUpdateAction && !inputValue && dataItem.plannedDocId) {
        setInputValue(dataItem.plannedDocId ?? '');
      }
    }, [values?.stepOrMPI]);

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
        setFieldValue(field, '');
        setInputValue('');
        return;
      }

      if (!inputVal && inputValue) {
        setFieldValue(field, '');
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

    const onChange = (event: React.ChangeEvent, value: OptionType) => {
      if (isTypeFieldEmpty) {
        return;
      }

      setSelectedObj(value);
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
      if (isTypeFieldEmpty) {
        return;
      }

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
      if (isTypeFieldEmpty) {
        toastError(translate('lhr.summary.type.empty.error.message'));
      }

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
          open={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          onInputChange={debounceFunction}
          disableClearable
          ListboxProps={{ onScroll }}
          loading={loading}
        />
      </FormikField>
    );
  }

  const plannedDocId = dataItem.plannedDocId;
  const plannedRevId = dataItem.plannedId;
  const plannedDocumentId = dataItem.plannedDocumentId;

  return (
    <>
      {plannedDocumentId ? (
        <Link
          to={documentVersionPath(
            plannedRevId,
            plannedDocumentId,
          )}
          target="_blank"
          id="PartOrEqDocLink-linkButton"
          className={classes.link}
        >
          {plannedDocId}
        </Link>
      ) : (
        plannedRevId || EMPTY_PLACEHOLDER
      )}
    </>
  );
};
