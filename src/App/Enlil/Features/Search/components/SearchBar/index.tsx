import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, ListSubheader, Popper } from '@material-ui/core';
import { RenderGroupParams } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import { History } from 'history';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { translate } from '../../../../../../common/intl';
import { changeRequestPreviewPath } from '../../../../../../ui/change.request/utils/paths';
import Text from '../../../../../../ui/components/Text';
import { Autocomplete } from '../../../../../../ui/components/forms/fields-next';
import { INPUT_DEBOUNCE_TIMEOUT } from '../../../../../../ui/constants/general';
import { documentVersionPath } from '../../../../../../ui/document.revision/utils/paths';
import { FB } from '../../../../../../ui/form.builder';
import { withThemeNext } from '../../../../../../ui/layout/theme-next';
import { MAX_TOP_RESULTS, getRecentSearch, searchPath, setLastRecentSearch, useSearchQuery } from '../../helpers';
import SearchState from '../../state';
import { FacetCategoryId, Option } from '../../types';
import useStyles from './styles';

const MIN_QUERY_LENGTH = 3;

const SearchBar: React.FC = () => {
  const history = useHistory() as History;
  const classes = useStyles();
  const fieldRef = useRef<HTMLDivElement>();
  const [searchQuery, setSearchQuery] = useState(useSearchQuery());
  const [isFocused, setIsFocused] = useState(false);
  const [popperClass, setPopperClass] = useState<string>();
  const inputField = fieldRef.current?.querySelector('input');
  const searchState = FB.useRef(SearchState);

  useEffect(() => {
    setPopperClass(isFocused ? classes.popperFocused : undefined);
  }, [isFocused, classes.popperFocused]);

  const initialSearchQuery = useSearchQuery();
  useEffect(() => {
    if (!initialSearchQuery) {
      setSearchQuery('');
    }
  }, [initialSearchQuery]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (inputField) {
      inputField.blur();
    }
  };

  const handleSearch = (event: React.ChangeEvent<unknown>, value: Option): void => {
    if (!value || !event) {
      return;
    }

    handleBlur();

    if (value.document?.id && value.document.typeName === FacetCategoryId.ChangeRequest) {
      history.push(changeRequestPreviewPath(value.document.id));
      return;
    }

    if (value.document?.id && value.document.docId) {
      history.push(documentVersionPath(value.document.id, value.document.docId));
      return;
    }

    const trimmedQuery = value.query?.trim();

    if (trimmedQuery) {
      setLastRecentSearch(trimmedQuery);
      setSearchQuery(trimmedQuery);
      history.push(searchPath(trimmedQuery));
      return;
    }

    setSearchQuery(searchQuery);
    history.push(searchPath(searchQuery));
  };

  const formatOptionLabel = (option: Option) => {
    if (option?.label) {
      return option.label;
    }
    if (option?.query) {
      return option.query;
    }
    return [
      option?.document?.typeId,
      option?.document?.title,
      option?.document?.companyName,
    ].filter(Boolean).join(' - ');
  };

  const handleQueryChange = (event: React.ChangeEvent<unknown>, value: string) => {
    if (event?.type === 'blur') {
      return;
    }
    if (event?.type === 'change') {
      setSearchQuery(value);
    }
  };

  const requestSearch = useMemo(
    () => debounce(
      (searchText: string) => {
        searchState.fetchSearch({
          searchText,
          offset: 0,
          limit: MAX_TOP_RESULTS,
        });
      },
      INPUT_DEBOUNCE_TIMEOUT,
    ),
    [searchState],
  );

  useEffect(() => {
    if (searchQuery.length < 3) {
      return searchState.reset();
    }

    if (isFocused) {
      requestSearch(searchQuery);
    }
  }, [searchState, requestSearch, searchQuery, isFocused]);

  const searchData = searchState.searchApi.data;

  const options = useMemo(() => {
    if (searchQuery.length <= MIN_QUERY_LENGTH && !searchData?.total) {
      return getRecentSearch().map((query) => ({
        query,
        group: translate('search.recent'),
      }));
    }

    const topResults: Option[] = searchData?.documents.map((document) => ({
      document,
      group: translate('search.found.count', { count: searchData.total }),
    })) ?? [];

    return topResults;
  }, [searchQuery, searchData]);

  const renderGroup = (params: RenderGroupParams) => {
    return (
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
        {(searchData?.total ?? 0) > MAX_TOP_RESULTS && (
          <Link
            className={classes.viewAll}
            to={searchPath(searchQuery)}
            onClick={handleBlur}
          >
            <Text
              message="search.view.all"
              values={{ count: searchData?.total }}
            />
          </Link>
        )}
      </li>
    );
  };

  const isLoading = searchState.searchApi.loading;

  return (
    <Autocomplete
      loading={isLoading}
      disablePortal
      options={options}
      filterOptions={(options: Option[]) => options}
      ref={fieldRef}
      placeholder={translate(isFocused ? 'keyword.to.search' : 'common.search')}
      className={cx(classes.root, classes.searchBarResponsive, { [classes.rootFocused]: isFocused })}
      onFocus={handleFocus}
      onBlur={handleBlur}
      noOptionsText={translate('nothing.found')}
      groupBy={(option: Option) => option?.group as string}
      getOptionLabel={formatOptionLabel}
      PopperComponent={(props) => <Popper {...props} className={popperClass} />}
      renderGroup={renderGroup}
      inputProps={{
        endAdornment: null,
        ['data-cy' as string]: 'global-search-bar',
        className: cx({ [classes.inputFocused]: isFocused }),
        startAdornment: (
          <InputAdornment position="start" className={ cx({ [classes.iconFocused]: isFocused }) }>
            <FontAwesomeIcon icon={regular('search')} />
          </InputAdornment>
        ),
        onKeyDown: (event) => { event.key === 'Enter' && handleSearch(event, { query: searchQuery }); },
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

export default withThemeNext(observer(SearchBar));
