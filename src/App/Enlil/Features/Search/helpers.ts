import { useLocation } from 'react-router-dom';
import { GLOBAL_SEARCH_URL } from '../../../../ui/constants/urls';
import qs from 'query-string';

export const PAGE_SIZE = 25;
export const MAX_TOP_RESULTS = 5;

const SEARCH_QUERY_PARAMETER = 'q';
const RECENT_SEARCH_STORAGE_KEY = 'recentSearch';
const MAX_RECENT_SEARCH_VALUES = 3;

export const useSearchQuery = (): string => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  return query.get(SEARCH_QUERY_PARAMETER) ?? '';
};

export const searchPath = (query: string) => ({
  pathname: GLOBAL_SEARCH_URL,
  search: '?' + qs.stringify({ [SEARCH_QUERY_PARAMETER]: query }),
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
