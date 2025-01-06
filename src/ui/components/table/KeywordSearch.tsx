import { light, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, InputAdornment, TextField } from '@material-ui/core';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { SEARCH_KEYWORD_FIELD_KEY } from '../KendoDataGrid/constants';
import { styles } from './KeywordSearch.styles';

interface KeywordSearchProps {
  applySearchFilter?: (searchText: string) => void
  clearSearchFilter?: () => void
  dataState: State
}

const KeywordSearch: React.FC<KeywordSearchProps> = ({
  applySearchFilter,
  clearSearchFilter,
  dataState,
}) => {
  const classes = styles();
  const [searchText, setSearchText] = useState('');

  const handleSearchClick = () => {
    if (searchText.trim()) {
      applySearchFilter?.(searchText);
    }
  };

  const handleClearClick = () => {
    setSearchText('');
    clearSearchFilter?.();
  };

  const getKeywordSearchValue = (
    filters?: Array<CompositeFilterDescriptor | FilterDescriptor>,
  ): string =>
    (
      filters?.find(
        (filter) =>
          'field' in filter && filter.field === SEARCH_KEYWORD_FIELD_KEY,
      ) as FilterDescriptor
    )?.value ?? '';

  useEffect(() => {
    setSearchText(getKeywordSearchValue(dataState?.filter?.filters));
  }, []);

  return (
    <TextField
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
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

export default KeywordSearch;
