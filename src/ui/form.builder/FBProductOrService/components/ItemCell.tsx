import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, Grid, TextField, Tooltip } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import {
  DocumentRevisionStatus,
  SearchRecordsResponse,
} from '../../../../state/ducks/documentRevisions/types';
import { FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useHover from '../../../hooks/useHover';
import { Colors } from '../../../layout/theme-next';
import { LIMIT, MIN_SEARCH_TERM_LENGTH } from '../constants';
import { CustomTemplateProps } from '../types';

interface CustomOptionType extends OptionType {
  revision: string
  title: string
  status: DocumentRevisionStatus
  createdDate?: string
  owner: string
  lifecyclePhase?: string
}

const Editor: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  const { setFieldValue } = useFormikContext();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<CustomOptionType[]>([]);
  const [selectedObj, setSelectedObj] = useState<OptionType>();
  const [offset, setOffset] = React.useState(0);
  const fetchReferences = useActionCreator(
    documentRevisionsActions.fetchReferences,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchOptionsDataAsync = useAsync({
    onSuccess: (data?: SearchRecordsResponse) => {
      if (!isUpdateAction && !selectedObj?.value) {
        setFieldValue('title', inputValue);
      }

      const modifiedItems
        = data?.items?.map((item) => {
          const label = translate(
            'form.builder.supplier.references.displayRevision',
            {
              docId: item.document?.docId,
              displayRevision: item.displayRevision,
              name: item?.name,
              status: item.status,
            },
          );

          return {
            label,
            itemDisplayName: label,
            value: item.id,
            revision: item.displayRevision,
            title: item?.name,
            status: item.status,
            createdDate: item.createdAt,
            owner: item.owner.user.id,
            lifecyclePhase: item?.lifecyclePhase?.displayLabel,
          };
        }) ?? [];

      if (isEmpty(inputValue)) {
        setItems((prev) => [...prev, ...modifiedItems]);
      } else {
        setItems(modifiedItems);
      }
    },
  });

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string) => {
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
    setSelectedObj(value);
    setInputValue(value?.label);
    setFieldValue(field, value?.value);
    setFieldValue('itemDisplayName', value?.label);
    setFieldValue('status', value?.status);
    setFieldValue('lifecyclePhase', value?.lifecyclePhase);
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
      const nextOffset = offset + LIMIT;
      setOffset(nextOffset);
      queryApi(nextOffset, inputValue);
    }
  };

  const queryApi = (offset: number, searchText?: string) => {
    fetchOptionsDataAsync.start(
      fetchReferences,
      searchText ?? '',
      offset,
      fetchOptionsDataAsync,
    );
  };

  useEffect(() => {
    if (isUpdateAction) {
      if (dataItem.title) {
        setInputValue(dataItem.title);
      } else if (dataItem.itemDisplayName) {
        setInputValue(dataItem.itemDisplayName);
      }
    } else {
      setInputValue('');
      if (fetchOptionsDataAsync.isLoading) {
        return;
      }

      setItems([]);
      queryApi(0);
    }
  }, [dataItem[MODE_FIELD]]);

  return (
    <FormikField name={dataItem.title ? 'title' : field}>
      <Autocomplete
        {...{ onChange }}
        key={isEmpty(items) ? 'disabled' : 'enabled'}
        value={{ label: inputValue }}
        options={items}
        getOptionLabel={(option) => option.label ?? ''}
        filterOptions={(x) => x}
        disabled={isUpdateAction}
        size="small"
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%" data-cy="records">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder={translate('common.select')}
                InputProps={{
                  ...params.InputProps,
                  style: { padding: '0px 30px 0px 9px', borderRadius: 3 },
                  startAdornment: <div>{params.InputProps.startAdornment}</div>,
                  endAdornment: (
                    <>
                      {fetchOptionsDataAsync.isLoading && (
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

export const ItemCell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, onClick, onOpenQuickView } = props;
  const [viewIconRef, isHovered] = useHover<HTMLButtonElement>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }
  const handleClick = () => onClick?.({ dataItem });
  const openQuickView = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => onOpenQuickView?.(evt, dataItem);

  return (<Grid
    justify="space-between"
    alignItems="center"
    container
    onClick={handleClick}
  >
    <Grid item xs={dataItem.title ? 12 : 10}>
      <OverflowContent data-cy="selected-product-or-service">
        {dataItem.itemDisplayName ?? dataItem.title}
      </OverflowContent>
    </Grid>
    {!dataItem.title && <Grid item xs={2}>
      <span ref={viewIconRef} onClick={openQuickView}>
        <Tooltip arrow title={translate('common.quick.view')} placement="top">
          <FontAwesomeIcon
            data-cy="quick-view"
            icon={isHovered ? solid('eye') : regular('eye')}
            color={isHovered ? Colors.navigationBg : Colors.textGray}
          />
        </Tooltip>
      </span>
    </Grid>}
  </Grid>
  );
};
