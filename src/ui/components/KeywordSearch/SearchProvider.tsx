import React, { useState } from 'react';
import { QueryType, SearchContext, TableSearchQueryPayloadType } from './types';

interface SearchProviderProps {
  children: React.ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const isKeywordSearchEnabled = true;
  const [query, setQuery] = useState<QueryType>();
  const [defaultQuery, setDefaultQuery] = useState<QueryType>();
  const [tableSearchQueryPayload, setTableSearchQueryPayload] = useState<TableSearchQueryPayloadType>();

  return (
    <SearchContext.Provider
      value={{
        query,
        defaultQuery,
        setQuery,
        setDefaultQuery,
        isKeywordSearchEnabled,
        tableSearchQueryPayload,
        setTableSearchQueryPayload,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
