import { createContext, Dispatch, SetStateAction } from 'react';

export type QueryType = string | undefined;

export interface SearchContextType {
  query?: QueryType
  defaultQuery?: QueryType
  setQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  setDefaultQuery?: Dispatch<SetStateAction<undefined | QueryType>>
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);
