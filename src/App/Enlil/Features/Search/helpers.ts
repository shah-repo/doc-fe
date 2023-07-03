import { useLocation } from 'react-router-dom';
import { ColumnDefinition } from '../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import { Status } from '../../../../ui/components/common/kendo.column.templates/Status';
import { GLOBAL_SEARCH_URL } from '../../../../ui/constants/urls';
import { IStoreMappedDocument } from './types';

export const PAGE_SIZE = 25;
export const MAX_TOP_RESULTS = 5;
export const RECENT_SEARCH_STORAGE_KEY = 'recentSearch';
export const MAX_RECENT_SEARCH_VALUES = 3;

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

export const sidebarOptions = [
  {
    id: 'document',
    label: 'Documents',
    count: 3525,
    payload: {
      documentTypeWithoutCategory: 'true',
    },
    items: [
      {
        id: 'revision',
        label: 'Document List',
        count: 1237,
      },
      {
        id: 'request',
        label: 'Approval Requests',
        count: 983,
      },
      {
        id: 'record',
        label: 'Records',
        count: 1305,
      },
    ],
  },
  {
    id: 'equipment',
    label: 'Equipment',
    count: 128,
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    count: 49,
  },
  {
    id: 'purchaseOrders',
    label: 'Purchase Orders',
    count: 27,
  },
  {
    id: 'receiving',
    label: 'Receiving',
    count: 13,
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    count: 509,
    items: [
      {
        id: 'parts',
        label: 'Parts',
        count: 130,
      },
      {
        id: 'eb',
        label: 'EBs',
        count: 248,
      },
      {
        id: 'lhr',
        label: 'LHR',
        count: 87,
      },
      {
        id: 'lot',
        label: 'Lots',
        count: 44,
      },
    ],
  },
  {
    id: 'training',
    label: 'Training',
    count: 3031,
    items: [
      {
        id: 'trainint-records',
        label: 'Training Records',
        count: 2883,
      },
      {
        id: 'curriculum',
        label: 'Training Curriculum',
        count: 148,
      },
    ],
  },
];

export const useSearchQuery = (): string => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  return query.get('q') ?? '';
};

export const searchPath = (query: string) => ({
  pathname: GLOBAL_SEARCH_URL,
  search: `?q=${query}`,
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
