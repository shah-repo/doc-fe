import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { State } from '@progress/kendo-data-query';
import { GridDataStateChangeEvent, GridProps } from '@progress/kendo-react-grid';
import { History } from 'history';
import { kebabCase, map, startCase } from 'lodash';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../../../common/intl';
import { TrainingRecordQuery } from '../../../../../../state/ducks/training/types';
import { changeRequestPreviewPath } from '../../../../../../ui/change.request/utils/paths';
import KendoDataGrid from '../../../../../../ui/components/KendoDataGrid/KendoDataGrid';
import Text from '../../../../../../ui/components/Text';
import { pagerSettings } from '../../../../../../ui/components/common/kendo/helpers';
import ExportListDialog from '../../../../../../ui/document.revision/list/ExportListDialog/ExportListDialog';
import { documentVersionPath } from '../../../../../../ui/document.revision/utils/paths';
import { FB } from '../../../../../../ui/form.builder';
import useDialog from '../../../../../../ui/hooks/useDialog';
import { withThemeNext } from '../../../../../../ui/layout/theme-next';
import TrainingDialog from '../../../../../../ui/training/details/TrainingDialog';
import { PAGE_SIZE, useSearchQuery } from '../../helpers';
import SearchState from '../../state';
import { Document, Facet, FacetCategoryId } from '../../types';
import FacetsList, { FacetOnChangeHandler, MappedFacet } from './components/FacetsList';
import schema from './schema';
import useStyles from './styles';

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
  const trainingDetailsDialog = useDialog();

  useEffect(() => {
    setQueryFacets([]);
    setCheckedFacets([]);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      searchState.fetchSearch({
        searchText: searchQuery,
        offset: dataState.skip,
        limit: dataState.take,
        sort: dataState.sort,
        facets: checkedFacets,
      });
    } else {
      searchState.reset();
    }
  }, [searchState, searchQuery, checkedFacets, dataState]);

  const searchData = searchState.searchApi.data;
  const trainingRecordData = searchState.trainingApi.data;

  // Store all possible facets for query from first response.
  useEffect(() => {
    if (!checkedFacets.length && searchData?.facets) {
      setQueryFacets(searchData.facets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData]);

  useEffect(() => {
    if (trainingRecordData) {
      trainingDetailsDialog.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingRecordData]);

  const updateResults = ({ dataState }: GridDataStateChangeEvent) => {
    setDataState(dataState);
    return dataState;
  };

  const headers = map(schema, (column) => ({
    label: startCase(translate(column?.title)),
    key: column.field ?? '',
  }));

  const handleRowClick: GridProps['onRowClick'] = ({ dataItem }) => {
    const { id, docId, typeName } = dataItem as Document;

    if (typeName === FacetCategoryId.TrainingRecord) {
      searchState.fetchTrainingRecord(id);
      return;
    }

    if (typeName === FacetCategoryId.ChangeRequest) {
      history.push(changeRequestPreviewPath(id));
      return;
    }

    if (docId) {
      history.push(documentVersionPath(id, docId));
    }
  };

  const exportData = (searchData?.documents ?? []).map(item => ({
    ID: item.typeId,
    Revision: item.revisionName,
    Title: item.title,
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

  const rowRender: GridProps['rowRender'] = (row, { dataItem }) => (
    React.cloneElement(row, {
      ['data-cy' as string]: `row-${kebabCase(dataItem.typeId)}`,
    })
  );

  const mappedFacets = mapFacets(queryFacets);

  const isLoading = searchState.searchApi.loading || searchState.trainingApi.loading;

  return (
    <Box className={classes.root}>
      <Box
        className={classes.title}
        data-cy="global-search-title"
      >
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
        <Box data-cy="global-search-facets">
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
      </Box>
      <Box className={classes.topbar}>
        <Box className={classes.toolbar}>
          <Box>
            <Text translation="search.result" />
          </Box>
          <Box
            className={classes.exportButton}
            data-cy="global-search-export"
            onClick={dialog.open}
          >
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
          loading={isLoading}
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
          rowHeight={40}
          rowRender={rowRender}
        />
      </Box>
      <ExportListDialog
        data={exportData}
        {...{ dialog, headers }}
        customFileName="DocumentList"
      />
      <TrainingDialog
        dialog={trainingDetailsDialog}
        training={trainingRecordData as TrainingRecordQuery}
      />
    </Box>
  );
};

export default withThemeNext(observer(SearchPage));
