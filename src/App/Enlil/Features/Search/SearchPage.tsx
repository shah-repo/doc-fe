import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { State } from '@progress/kendo-data-query';
import { GridDataStateChangeEvent } from '@progress/kendo-react-grid';
import { clone, concat, get, map, startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Text from '../../../../../src/ui/components/Text';
import { pagerSettings } from '../../../../ui/components/common/kendo/helpers';
import KendoDataGrid from '../../../../ui/components/KendoDataGrid/KendoDataGrid';
import { toastError } from '../../../../ui/components/notifications';
import ExportListDialog from '../../../../ui/document.revision/list/ExportListDialog/ExportListDialog';
import useDialog from '../../../../ui/hooks/useDialog';
import { withThemeNext } from '../../../../ui/layout/theme-next';
import { columnsSchema, PAGE_SIZE, searchResultsDraft, useSearchQuery } from './helpers';
import useStyles from './SearchPage.styles';
import Sidebar from './SideBar';
import { FB } from '../../../../ui/form.builder';
import SearchState from './Search.state';

const SearchPage: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const classes = useStyles();
  const searchQuery = useSearchQuery();
  const dialog = useDialog();
  const [filterData, setFilterData] = useState([]);
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
  const [searchResults, setSearchResults] = useState(searchResultsDraft);
  const searchState = FB.useRef(SearchState);

  useEffect(() => {
    if (searchQuery) {
      searchState.request({
        searchText: searchQuery,
        offset: dataState.skip,
        limit: dataState.take,
      }).then(({ data }) => {
        setSearchResults({
          results: data.results,
          page_total: data.page_total,
          total: data.total,
        });
        let tempData = [];
        data.results.map((documents) => {
          tempData = concat(tempData, get(documents, 'documents'));
        });
        setFilterData(tempData);
      }).catch((error) => {
        toastError(error);
      });
    }
  }, [searchQuery, dataState]);

  const updateFilter = (data) => {
    let tempData = [];
    data.map((documents) => {
      tempData = concat(tempData, get(documents, 'documents'));
    });
    setFilterData(tempData);
  };

  const updateResults = ({ dataState }: GridDataStateChangeEvent) => {
    setDataState(dataState);
    return dataState;
  };

  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : '';

  const headers = map(columnsSchema, (column) => ({
    label: startCase(getTranslatedText(column?.title)),
    key: column.field,
  }));

  const resultText = searchQuery ? `${searchResults.total} results found for "${searchQuery}"` : 'Search';

  const handleRowClick = (values) => {
    const { dataItem } = values;
    if (dataItem?.id && dataItem?.revisionId) {
      history.push(`/document_revision/${dataItem.id}/version/${dataItem.revisionId}`);
    }
  };

  const exportData = clone(filterData).map(item => {
    const data = {
      ID: item.docId,
      Revision: item.displayRevision,
      Title: item.revisionName,
      Owner: item.userName,
      Status: item.status,
    };
    return data;
  });

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>
        {resultText}
      </Box>
      <Box className={classes.sidebar}>
        <Sidebar options={searchResults.results} onChange={updateFilter} />
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
          schema={columnsSchema}
          data={filterData}
          total={searchResults.total}
          pageable={pagerSettings}
          pageSize={PAGE_SIZE}
          {...dataState}
          onDataStateChange={updateResults}
          noDataProcessing
          fallback={intl.formatMessage({ id: 'nothing.found' })}
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

export default withThemeNext(SearchPage);
