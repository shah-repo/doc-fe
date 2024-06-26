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
  Mode, MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { LIMIT, MIN_SEARCH_TERM_LENGTH, STEP_FIELD } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, LHRSummaryOptionsResponse } from '../../types';
import { getDisplayDocument } from '../../utils';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const { getFieldProps, setFieldValue, values }
      = useFormikContext<EditableLHRSummaryItem>();
  const classes = styles();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const [inputValue, setInputValue] = useState('');
  const [selectedObj, setSelectedObj] = useState<OptionType>();
  const [items, setItems] = useState<OptionType[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stepOrMpiDetails = values?.stepOrMpiDetails;
    const docId = stepOrMpiDetails?.docId;

    if (isEmpty(stepOrMpiDetails)) {
      return;
    }

    if (isUpdateAction && !inputValue) {
      setInputValue(docId ?? dataItem[field] ?? '');
    }
  }, [values?.stepOrMPI]);

  const fetchLHRSummaryByOptionId = useActionCreator(lhrSummaryActions.fetchLHRSummaryDataByOptionId);

  const fetchOptionsDataAsync = useAsync({
    onSuccess: (data?: LHRSummaryOptionsResponse) => {
      if (!isUpdateAction && !selectedObj?.value) {
        setFieldValue(field, inputValue);
      }

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
    if (!inputVal && inputValue) {
      setFieldValue(field, '');
    }

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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onChange = (event: React.ChangeEvent<{}>, value: OptionType) => {
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

    if (fetchOptionsDataAsync.isLoading) {
      return;
    }

    setItems([]);
    queryApi(0);
  }, [dataItem[MODE_FIELD], values.type]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item style={{ width: '30%' }}>
          <FormikField name={STEP_FIELD}>
            <TextField
              {...getFieldProps(STEP_FIELD)}
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
              renderInput={(params: RenderInputParams) => (
                <Box display="flex">
                  <Box width="100%" data-cy="mpi">
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
        </Grid>
      </Grid>
    </>
  );
};

export const StepCell: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const { docId, documentId, displayRevision, value } = dataItem?.stepOrMpiDetails ?? {};
  const step = dataItem.step;
  const mpiRevId = value?.split('/')[1];

  if (isEditMode) {
    return <Editor {...props} />;
  }

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
        {docId && documentId ? (
          <span className={classes.mpi}>
            <Link
              to={documentVersionPath(mpiRevId, documentId)}
              target="_blank"
              id="step-mpi-field"
              data-cy="step-mpi-field"
              className={classes.link}
            >
              {getDisplayDocument(docId, displayRevision)}
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
