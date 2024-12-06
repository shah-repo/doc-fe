import {
  Box,
  Grid,
  TextField,
} from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import { FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { LIMIT } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

interface CustomOptionType extends OptionType {
  revision: string
  quantity: string
  comments: string
}

const Editor: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  const { setFieldValue } = useFormikContext();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<CustomOptionType[]>([]);
  const [offset, setOffset] = React.useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onInputChange = (event: React.ChangeEvent<{}>, inputVal: string) => {
    if (inputValue === inputVal && !isEmpty(inputVal)) {
      return;
    }
    setInputValue(inputVal);
  };

  const onChange = (event: React.ChangeEvent<{}>, value: CustomOptionType) => {
    setInputValue(value?.label);
    setFieldValue(field, value?.value);
    setFieldValue('quantity', value?.quantity);
    setFieldValue('comments', value?.comments);
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
    }
  };

  useEffect(() => {
    if (isUpdateAction) {
      dataItem.itemId
        && setInputValue(dataItem.itemId);
    } else {
      setInputValue('');
      setItems([]);
    }
  }, [dataItem[MODE_FIELD]]);

  return (
    <FormikField name={field}>
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
            <Box width="100%" data-cy="reference-items">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder={translate('common.select')}
                InputProps={{
                  ...params.InputProps,
                  style: { padding: '0px 30px 0px 9px', borderRadius: 3 },
                  startAdornment: <div>{params.InputProps.startAdornment}</div>,
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
      />
    </FormikField>
  );
};

export const RefIDcell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, onClick } = props;
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  return (
    <Grid
      justify="flex-start"
      alignItems="center"
      container
      onClick={handleClick}
      data-cy="reference-cell"
    >
      <Grid item xs={10} className={classes.grid}>
        {dataItem.itemId}
      </Grid>
    </Grid>
  );
};
