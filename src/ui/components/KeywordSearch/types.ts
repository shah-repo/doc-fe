import { AxiosRequestConfig } from 'axios';
import { createContext, Dispatch, SetStateAction } from 'react';

export type QueryType = string | undefined;

export type TableSearchQueryPayloadType = AxiosRequestConfig['data'];

export interface SearchContextType {
  query?: QueryType
  defaultQuery?: QueryType
  setQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  setDefaultQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  isKeywordSearchEnabled?: boolean
  tableSearchQueryPayload?: TableSearchQueryPayloadType
  setTableSearchQueryPayload?: Dispatch<SetStateAction<TableSearchQueryPayloadType | QueryType>>
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);
