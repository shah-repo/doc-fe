import { createContext, Dispatch, SetStateAction } from 'react';
import { ASLStatus } from '../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';

export type QueryType = string | undefined;

export interface SearchContextType {
  query?: QueryType
  defaultQuery?: QueryType
  setQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  setDefaultQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  isKeywordSearchEnabled?: boolean
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export interface DocTypeTableContextType {
  aslStatuses?: ASLStatus[]
}

export const DocTypeTableContext = createContext<DocTypeTableContextType | undefined>(undefined);
