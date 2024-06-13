import { Box, CircularProgress, Grid, TextField as MuiTextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FBAutocompleteAsyncOption } from '../../..';
import { translate } from '../../../../../common/intl';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
import {
  FormikField,
  TextField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { LIMIT, MIN_SEARCH_TERM_LENGTH } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, LHRSummaryOptionsResponse } from '../../types';
import { styles } from './styles';

export const StepCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    const stepField = 'step';
    const { getFieldProps, setFieldValue, values }
      = useFormikContext<EditableLHRSummaryItem>();

    const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedObj, setSelectedObj] = useState<OptionType>();
    const [items, setItems] = useState<OptionType[]>([]);
    const [offset, setOffset] = React.useState(0);

    useEffect(() => {
      if (isUpdateAction && !inputValue && !dataItem.stepOrMpiDocumentId) {
        setInputValue(dataItem[field] ?? '');
      }
      if (isUpdateAction && !inputValue && dataItem.stepOrMpiDocumentId) {
        setInputValue(dataItem.stepOrMpiDocId ?? '');
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
      setInputValue(inputVal);
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

    const queryApi = (offset: number, searchText?: string) => {
      setLoading(true);
      fetchOptionsDataAsync.start(
        fetchLHRSummaryByOptionId,
        searchText ?? '',
        FBAutocompleteAsyncOption.mpiDocuments,
        offset,
        fetchOptionsDataAsync,
      );
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
      <>
        <Grid container spacing={2}>
          <Grid item style={{ width: '30%' }}>
            <FormikField name={stepField}>
              <TextField
                {...getFieldProps(stepField)}
                defaultValue={undefined}
                fullWidth={false}
                placeholder={translate('lhr.summary.placeholder.enter')}
                type="text"
                size="small"
              />
            </FormikField>
          </Grid>
          <Grid
            item
            justify="center"
            alignItems="center"
            style={{ paddingTop: 10 }}
          >
            /
          </Grid>
          <Grid item style={{ width: '60%' }}>
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
                      <MuiTextField
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
                disableClearable
                ListboxProps={{ onScroll }}
                loading={loading}
              />
            </FormikField>
          </Grid>
        </Grid>
      </>
    );
  }

  const step = dataItem.step;
  const mpiDocId = dataItem.stepOrMpiDocId;
  const mpiRevId = dataItem.stepOrMPI?.split('/')[1];
  const mpiDocumentId = dataItem.stepOrMpiDocumentId;

  return (
    <>
      <span className={classes.stepCellContainer}>
        <span className={classes.step}>
          <OverflowTooltip
            title={step}
            placement="top"
            interactive
            arrow
            data-cy="step-field"
          >
            {step}
          </OverflowTooltip>
        </span>
        <span className={classes.seperator}>/</span>
        {mpiDocId && mpiDocumentId ? (
          <span className={classes.mpi}>
            <Link
              to={documentVersionPath(mpiRevId, mpiDocumentId)}
              target="_blank"
              id="step-mpi-field"
              data-cy="step-mpi-field"
              className={classes.link}
            >
              {mpiDocId}
            </Link>
          </span>
        ) : (
          <span className={classes.mpi} data-cy="step-mpi-field">
            {mpiRevId}
          </span>
        )}
      </span>
    </>
  );
};
