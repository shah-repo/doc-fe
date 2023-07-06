import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { State } from '@progress/kendo-data-query';
import { GridDataStateChangeEvent, GridProps } from '@progress/kendo-react-grid';
import { clone, map, startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import Text from '../../../../../../ui/components/Text';
import { pagerSettings } from '../../../../../../ui/components/common/kendo/helpers';
import KendoDataGrid from '../../../../../../ui/components/KendoDataGrid/KendoDataGrid';
import ExportListDialog from '../../../../../../ui/document.revision/list/ExportListDialog/ExportListDialog';
import useDialog from '../../../../../../ui/hooks/useDialog';
import { withThemeNext } from '../../../../../../ui/layout/theme-next';
import { PAGE_SIZE, useSearchQuery } from '../../helpers';
import schema from './schema';
import useStyles from './styles';
import { FB } from '../../../../../../ui/form.builder';
import SearchState from '../../state';
import { observer } from 'mobx-react';
import { translate } from '../../../../../../common/intl';
import { Facet } from '../../types';
import FacetsList, { FacetOnChangeHandler, MappedFacet } from './components/FacetsList';

const SearchPage: React.FC = () => {
  const history = useHistory() as History;
  const classes = useStyles();
  const searchQuery = useSearchQuery();
  const dialog = useDialog();
  const [queryFacets, setQueryFacets] = useState<Facet[]>([]);
  const [checkedFacets, setCheckedFacets] = useState<string[]>([]);
  const [dataState, setDataState] = useState<State>({
    filter: {
      logic: 'and',
      filters: [],
    },
    skip: 0,
    take: PAGE_SIZE,
    group: [],
    sort: [],
  });
  const searchState = FB.useRef(SearchState);

  useEffect(() => {
    setQueryFacets([]);
    setCheckedFacets([]);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      searchState.request({
        searchText: searchQuery,
        offset: dataState.skip,
        limit: dataState.take,
        sort: dataState.sort,
        facets: checkedFacets,
      });
    }
  }, [searchState, searchQuery, checkedFacets, dataState]);

  const searchData = searchState.data;

  // Store all possible facets for query from first response.
  useEffect(() => {
    if (!checkedFacets.length && searchData?.facets) {
      setQueryFacets(searchData.facets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData]);

  const updateResults = ({ dataState }: GridDataStateChangeEvent) => {
    setDataState(dataState);
    return dataState;
  };

  const headers = map(schema, (column) => ({
    label: startCase(translate(column?.title)),
    key: column.field ?? '',
  }));

  const handleRowClick: GridProps['onRowClick'] = ({ dataItem }) => {
    if (dataItem?.id && dataItem?.revisionId) {
      history.push(`/document_revision/${dataItem.id}/version/${dataItem.revisionId}`);
    }
  };

  const exportData = clone(searchData?.documents ?? []).map(item => ({
    ID: item.docId,
    Revision: item.displayRevision,
    Title: item.revisionName,
    Owner: item.userName,
    Status: item.status,
  }));

  const handleFacetsDeselect = () => {
    setCheckedFacets([]);
  };

  const handleFacetsChange: FacetOnChangeHandler = ({ id, checked }) => {
    setCheckedFacets(checkedIds => {
      if (checked && !checkedIds.includes(id)) {
        return [...checkedIds, id];
      }

      if (!checked) {
        return checkedIds.filter(checkedId => checkedId !== id);
      }

      return checkedIds;
    });
  };

  function mapFacets (facets: Facet[]): MappedFacet[] {
    return facets.map(facet => {
      const mappedChildren = facet.children ? mapFacets(facet.children) : undefined;

      return ({
        ...facet,
        checked: checkedFacets.includes(facet.id) || Boolean(mappedChildren?.some(item => item.checked)),
        ...mappedChildren && { children: mappedChildren },
      } as MappedFacet);
    });
  }

  const mappedFacets = mapFacets(queryFacets);

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>
        {!searchQuery && <Text translation="common.search" />}
        {searchQuery && (
          <Text
            translation="search.results"
            values={{
              count: searchData?.total ?? 0,
              query: searchQuery,
            }}
          />
        )}
      </Box>
      <Box className={classes.sidebar}>
        <Box className={classes.toolbar}>
          <Box>
            <Text message="search.facets.header" />
          </Box>
          {checkedFacets.length > 0 && (
            <Box
              className={classes.selectButton}
              onClick={handleFacetsDeselect}
            >
              <Text message="common.deselect.all" />
            </Box>
          )}
        </Box>
        <FacetsList
          facets={mappedFacets}
          onChange={handleFacetsChange}
        />
      </Box>
      <Box className={classes.topbar}>
        <Box className={classes.toolbar}>
          <Box>
            <Text translation="search.result" />
          </Box>
          <Box className={classes.exportButton} onClick={dialog.open}>
            <FontAwesomeIcon
              className={classes.exportButtonIcon}
              icon={regular('up-from-bracket')}
            />
            <Text translation="common.export" />
          </Box>
        </Box>
      </Box>
      <Box className={classes.grid}>
        <KendoDataGrid
          schema={schema}
          data={searchData?.documents ?? []}
          total={searchData?.total}
          pageable={pagerSettings}
          pageSize={PAGE_SIZE}
          {...dataState}
          onDataStateChange={updateResults}
          skipDataProcessing
          fallback={translate('nothing.found')}
          sortable
          resizable
          fullWidth
          fullHeight
          onRowClick={handleRowClick}
        />
      </Box>
      <ExportListDialog
        data={exportData}
        {...{ dialog, headers }}
        customFileName="DocumentList"
      />
    </Box>
  );
};

export default withThemeNext(observer(SearchPage));
