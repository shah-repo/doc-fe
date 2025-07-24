import { light, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, InputAdornment, TextField } from '@material-ui/core';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { translate } from '../../../common/intl';
import useStyles from './styles';
import { QueryType, SearchContext } from './types';

interface SearchBarProps {
  tableName?: string
}
const SearchBar: React.FC<SearchBarProps> = ({ tableName }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState<QueryType>('');
  const { setQuery, defaultQuery, setDefaultQuery } = useContext(SearchContext);

  useEffect(() => {
    setSearchText(undefined);
    setDefaultQuery?.(undefined);
    setQuery?.(undefined);
  }, [tableName]);

  useEffect(() => {
    setSearchText(defaultQuery ?? '');
  }, [defaultQuery]);

  const handleSearchClick = () => {
    if (searchText?.trim()) {
      setQuery?.(searchText);
    }
  };

  const handleClearClick = () => {
    setSearchText('');
    setQuery?.('');
  };

  const onHandleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    event.key === 'Enter' && setQuery?.(searchText);
  };

  const onHandleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    if (value === '' && searchText !== '') {
      handleClearClick();
    }
    setSearchText(value);
  };

  return (
    <TextField
      value={searchText}
      onChange={onHandleChange}
      onKeyDown={onHandleKeyDown}
      placeholder={translate('common.search.keyword')}
      variant="outlined"
      size="small"
      data-cy="keyword-search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={light('search')} />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            {searchText && (
              <InputAdornment position="end" className={classes.clear}>
                <FontAwesomeIcon
                  icon={regular('xmark')}
                  onClick={handleClearClick}
                  aria-label="Clear search"
                  data-cy="keyword-search-clear"
                />
              </InputAdornment>
            )}
            <InputAdornment position="end">
              <Divider className={classes.divider} orientation="vertical" />
              <FontAwesomeIcon
                icon={regular('arrow-right')}
                onClick={handleSearchClick}
                aria-label="Search"
                data-cy="keyword-search-confirm"
                className={classes.confirm}
              />
            </InputAdornment>
          </>
        ),
      }}
    />
  );
};

export default SearchBar;
