import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, ListSubheader, Popper } from '@material-ui/core';
import { RenderGroupParams } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '../../../../ui/components/forms/fields-next';
import { withThemeNext } from '../../../../ui/layout/theme-next';
import { MAX_TOP_RESULTS, recentSearches, searchPath, useSearchQuery } from './helpers';
import useStyles from './Search.styles';
import { GroupedOption, OptionType } from './types';
import { FB } from '../../../../ui/form.builder';
import SearchState from './Search.state';
import { observer } from 'mobx-react';

const Search: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const classes = useStyles();
  const fieldRef = useRef<HTMLDivElement>();
  const [searchQuery, setSearchQuery] = useState(useSearchQuery());
  const [isFocused, setIsFocused] = useState(false);
  const [popperClass, setPopperClass] = useState<string>();
  const [savedQuery, setSavedQuery] = useState(searchQuery);
  const inputField = fieldRef.current?.querySelector('input');
  const searchState = FB.useRef(SearchState);

  useEffect(() => {
    setPopperClass(isFocused ? classes.popperFocused : undefined);
  }, [isFocused, classes.popperFocused]);

  const unfocusField = () => {
    setIsFocused(false);
    setSavedQuery(searchQuery);
    if (inputField) {
      inputField.blur();
    }
  };

  useEffect(() => {
    if (inputField && !isFocused) {
      setSearchQuery(savedQuery);
    }
  }, [inputField, isFocused, savedQuery]);

  const handleSearch = (event: React.ChangeEvent<unknown>, value: OptionType) => {
    if (!value || !event) {
      return;
    }
    if (typeof value === 'string' || 'query' in value) {
      const query = typeof value === 'string' ? value : value.query;
      setSearchQuery(query);
      unfocusField();
      return history.push(searchPath(query));
    }

    if (value.id && value.revisionId) {
      return history.push(`/document_revision/${value.id}/version/${value.revisionId}`);
    }
    unfocusField();
    return history.push(searchPath(searchQuery));
  };

  const handleFocusChange = (focused: boolean) => () => setIsFocused(focused);

  const formatOptionLabel = (option: OptionType) => {
    if (typeof option === 'string') {
      return option;
    }
    if ('label' in option) {
      return option.label;
    }
    if ('query' in option) {
      return option.query;
    }
    return [option.docId, option.revisionName, option.companyName].filter(Boolean).join(' - ');
  };

  const handleQueryChange = (event: React.ChangeEvent<unknown>, value: string) => {
    if (!event || !isFocused) {
      return;
    }
    setSearchQuery(value);
  };

  useEffect(() => {
    if (searchQuery.length >= 3 && isFocused) {
      searchState.request({
        searchText: searchQuery,
        offset: 0,
        limit: MAX_TOP_RESULTS,
      });
    }
  }, [searchQuery, isFocused]);

  const searchResults = searchState.data;

  const options = useMemo(() => {
    if (searchQuery.length <= 3 && !searchResults?.total) {
      return recentSearches.map((el) => ({
        query: el,
        group: intl.formatMessage({ id: 'search.recent' }),
      }));
    }

    const topResults: OptionType[] = searchResults?.documents.map((el) => ({
      ...el,
      group: intl.formatMessage({ id: 'search.found.count' }, { count: searchResults.total }),
    })) ?? [];

    if (searchResults?.total && searchResults.total > MAX_TOP_RESULTS) {
      topResults.push({
        label: intl.formatMessage({ id: 'search.view.all' }, { count: searchResults.total }),
        query: searchQuery,
      });
    }

    return topResults;
  }, [intl, searchQuery, searchResults]);

  const renderGroup = (params: RenderGroupParams) => (
    <li key={params.key}>
      <ListSubheader
        className={cx(classes.listGroupLabel, { [classes.listGroupAllLabel]: !params.key })}
      >
        {params.key}
      </ListSubheader>
      <ul
        className={cx(classes.listGroup, { [classes.listGroupAll]: !params.key })}
      >
        {params.children}
      </ul>
    </li>
  );

  const placeholder = intl.formatMessage({ id: isFocused ? 'keyword.to.search' : 'common.search' });
  return (
    <Autocomplete
      disablePortal
      options={options}
      ref={fieldRef}
      filterOptions={(options: OptionType[]) => options}
      placeholder={placeholder}
      className={cx(classes.root, { [classes.rootFocused]: isFocused })}
      onFocus={handleFocusChange(true)}
      onBlur={handleFocusChange(false)}
      noOptionsText={intl.formatMessage({ id: 'nothing.found' })}
      groupBy={(option: GroupedOption) => option.group}
      getOptionLabel={formatOptionLabel}
      PopperComponent={(props) => <Popper {...props} className={popperClass} />}
      renderGroup={renderGroup}
      inputProps={{
        endAdornment: null,
        className: cx({ [classes.inputFocused]: isFocused }),
        startAdornment: (
          <InputAdornment position="start" className={ cx({ [classes.iconFocused]: isFocused }) }>
            <FontAwesomeIcon icon={regular('search')} />
          </InputAdornment>
        ),
        onKeyDown: (event) => { event.key === 'Enter' && handleSearch(event, searchQuery); },
      }}
      onInputChange={handleQueryChange}
      inputValue={searchQuery}
      classes={{
        paper: classes.listPaper,
        option: classes.listOption,
      }}
      onChange={handleSearch}
      value=""
    />
  );
};

export default withThemeNext(observer(Search));
