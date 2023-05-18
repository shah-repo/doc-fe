import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import React from 'react';
import { searchQueryString } from './helpers';
import { StyledSearchTextField } from './styles';
import { TableSearchFieldProps } from './types';

type Props = Partial<TableSearchFieldProps>;

export const TableSearchTextField: React.FunctionComponent<Props> = ({
  dataKey = '',
  searchValueGetter,
  queryGetter,
  defaultValue,
}) => {
  const [value, setValue] = React.useState<string | number>(defaultValue || '');

  React.useEffect(() => {
    (!value || !defaultValue) && setValue(defaultValue || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const query = event.target.value;
    setValue(query);

    if (!queryGetter) { return; }
    const finalQuery = searchQueryString({ query, searchValueGetter });
    queryGetter(dataKey, finalQuery);
  };

  return (
    <StyledSearchTextField
      id={dataKey}
      value={value}
      name={dataKey}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      margin="normal"
      InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
      inputProps={{ 'data-lpignore': true }}
    />
  );
};

TableSearchTextField.displayName = 'TableSearchTextField';
