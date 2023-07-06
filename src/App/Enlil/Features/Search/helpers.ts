import { useLocation } from 'react-router-dom';
import { ColumnDefinition } from '../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import { Status } from '../../../../ui/components/common/kendo.column.templates/Status';
import { GLOBAL_SEARCH_URL } from '../../../../ui/constants/urls';
import { IStoreMappedDocument } from './types';
import qs from 'query-string';

export const PAGE_SIZE = 25;
export const MAX_TOP_RESULTS = 5;
const RECENT_SEARCH_STORAGE_KEY = 'recentSearch';
const MAX_RECENT_SEARCH_VALUES = 3;

export const columnsSchema: Array<ColumnDefinition<IStoreMappedDocument>> = [
  {
    id: 'id',
    field: 'docId',
    title: 'ID',
    width: 130,
  },
  {
    id: 'revision',
    field: 'displayRevision',
    title: 'Revision',
    width: 120,
  },
  {
    id: 'title',
    field: 'revisionName',
    title: 'Title',
  },
  {
    id: 'owner',
    field: 'userName',
    title: 'Owner',
    width: 180,
  },
  {
    id: 'status',
    field: 'status',
    title: 'Status',
    cell: Status,
    width: 120,
  },
];

export const useSearchQuery = (): string => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  return query.get('q') ?? '';
};

export const searchPath = (query: string) => ({
  pathname: GLOBAL_SEARCH_URL,
  search: '?' + qs.stringify({ q: query }),
});

export const getRecentSearch = (): string[] => {
  try {
    const recentSearchString = localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);

    if (recentSearchString) {
      return JSON.parse(recentSearchString) as string[];
    }
  } catch (error) {
    console.error(error);
  }

  return [];
};

export const setLastRecentSearch = (query: string): string[] => {
  const newRecentSearch = Array.from(
    new Set([query, ...getRecentSearch()]),
  ).slice(0, MAX_RECENT_SEARCH_VALUES);

  localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(newRecentSearch));

  return newRecentSearch;
};
