import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, ListSubheader, Popper } from '@material-ui/core';
import { RenderGroupParams } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Autocomplete } from '../../../../ui/components/forms/fields-next';
import { withThemeNext } from '../../../../ui/layout/theme-next';
import { getRecentSearch, MAX_TOP_RESULTS, searchPath, setLastRecentSearch, useSearchQuery } from './helpers';
import useStyles from './Search.styles';
import { Option } from './types';
import { FB } from '../../../../ui/form.builder';
import SearchState from './Search.state';
import { observer } from 'mobx-react';
import { translate } from '../../../../common/intl';
import { debounce } from 'lodash';

const Search: React.FC = () => {
  const history = useHistory();
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

    if (value?.document?.id && value?.document?.revisionId) {
      history.push(`/document_revision/${value.document.id}/version/${value.document.revisionId}`);
      return;
    }

    if (value?.query) {
      setLastRecentSearch(value.query);

      setSearchQuery(value.query);
      history.push(searchPath(value.query));
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
      option?.document?.docId,
      option?.document?.revisionName,
      option?.document?.companyName,
    ].filter(Boolean).join(' - ');
  };

  const handleQueryChange = (event: React.ChangeEvent<unknown>, value: string) => {
    if (event?.type === 'blur') {
      return;
    }
    setSearchQuery(value);
  };

  const requestSearch = useMemo(
    () => debounce(
      (searchText: string) => {
        searchState.request({
          searchText,
          offset: 0,
          limit: MAX_TOP_RESULTS,
        });
      },
      300,
    ),
    [searchState],
  );

  useEffect(() => {
    if (searchQuery.length >= 3 && isFocused) {
      requestSearch(searchQuery);
    }
  }, [requestSearch, searchQuery, isFocused]);

  const searchData = searchState.data;

  const options = useMemo(() => {
    if (searchQuery.length <= 3 && !searchData?.total) {
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
            {translate('search.view.all', { count: searchData?.total })}
          </Link>
        )}
      </li>
    );
  };

  return (
    <Autocomplete
      disablePortal
      options={options}
      filterOptions={(options: Option[]) => options}
      ref={fieldRef}
      placeholder={translate(isFocused ? 'keyword.to.search' : 'common.search')}
      className={cx(classes.root, { [classes.rootFocused]: isFocused })}
      onFocus={handleFocus}
      onBlur={handleBlur}
      noOptionsText={translate('nothing.found')}
      groupBy={(option: Option) => option?.group as string}
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

export default withThemeNext(observer(Search));
