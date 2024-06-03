import { Box, CircularProgress, TextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { intl, translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import {
  DocumentRevision,
} from '../../../../../state/ducks/documentRevisions/types';
import { FormikField } from '../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { styles } from './styles';

const MIN_SEARCH_TERM_LENGTH = 3;

export const SearchActualIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = styles();

  const actualDocId = dataItem.actualDocId;
  const actualRevId = dataItem.actualId;
  const actualDocumentId = dataItem.actualDocumentId;

  if (isEditMode) {
    const { values, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();

    const onChange = (e, value) => {
      setInputValue(value?.label);
      setFieldValue(field, value?.value);
    };

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    const [parts, setParts] = useState<DocumentRevision[]>([]);

    useEffect(() => {
      if (!inputValue && values?.actualDocId) {
        setFieldValue('prevActualId', values[field]);
        setFieldValue('prevActualDocId', values?.actualDocId);
        setInputValue(values?.actualDocId);
      }
    }, [values?.actualDocId]);

    const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);
    // offset - 0, limit - 25
    const fetchAvailablePartsAsync = useAsync({
      onSuccess: (data: DocumentRevision[] = []) => {
        setLoading(false);
        setParts(data);
      },
    });

    const [offset, setOffset] = React.useState(0);
    const limit = 25;

    const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string) => {
      setFieldValue(field, inputVal);
      setInputValue(inputVal);
      if (inputVal && inputVal.length >= MIN_SEARCH_TERM_LENGTH) {
        setOffset(0);
        queryApi(0, inputVal);
      } else if (!inputVal) {
        setOffset(0);
        queryApi(0);
      }
    };

    const debounceFunction = debounce(onInputChange, 1000, {
      leading: true,
      trailing: true,
    });

    const onScroll = (event: React.SyntheticEvent) => {
      const listboxNode = event.currentTarget;
      if (
        Math.ceil(listboxNode.scrollHeight - listboxNode.scrollTop)
      === listboxNode.clientHeight
      ) {
        const nextOffset = offset + limit;
        setOffset(nextOffset);
        queryApi(nextOffset, inputValue);
      }
    };

    const queryApi = (offset: number, searchText?: string) => {
      console.log('Offset, search String', offset, searchText);
      // queryParams.offset = offset;
      // queryParams.searchText = searchText || null;
      // loadAction([], queryParams);
      setLoading(true);
      fetchAvailablePartsAsync.start(
        fetchAvailablePartsAction,
        fetchAvailablePartsAsync,
      );
    };

    const onOpen = () => {
      setOpen(true);
      setOffset(0);
      queryApi(0);
    };

    const renderOptions = () => {
      return parts.map((part) => ({
        label: translate('wo.displayRevision', { docId: part.document?.docId, displayRevision: part?.displayRevision, name: part?.name }),
        value: part.id,
      }));
    };

    return (
      <FormikField name={field}>
        <Autocomplete
          {...{ onChange }}
          classes={{ option: classes.option }}
          value={{ label: inputValue }}
          options={renderOptions()}
          getOptionLabel={(option) => option.label }
          // disable filtering on client
          filterOptions={(x) => x}
          size="small"
          renderInput={(params: RenderInputParams) => (
            <Box display="flex">
              <Box width="100%" data-cy="actualId">
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  placeholder={open ? undefined : intl.formatMessage({ id: 'search.min.char' }, { count: MIN_SEARCH_TERM_LENGTH })}
                  InputProps={{
                    ...params.InputProps,
                    style: { padding: '0px 30px 0px 9px' },
                    startAdornment: (
                      <div>
                        {params.InputProps.startAdornment}
                      </div>
                    ),
                    endAdornment: (
                      <>
                        { open && loading && (
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
          open={open}
          onOpen={onOpen}
          onClose={() => {
            setOpen(false);
          }}
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
