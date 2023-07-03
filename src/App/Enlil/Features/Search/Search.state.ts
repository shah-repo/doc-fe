import { action } from 'mobx';
import FBRequest from '../../../../ui/form.builder/FBApi/FBApi.request';
import { FBEndpoint } from '../../../../ui/form.builder/defaults/FBEndpoint';
import { PAGE_SIZE } from './helpers';
import { IStoreResult } from './types';
import { SortDescriptor } from '@progress/kendo-data-query';

interface Body {
  searchText: string
  facets?: string[]
  limit?: number
  offset?: number
  sort?: SortDescriptor[]
}

class SearchState extends FBRequest<IStoreResult, Body> {
  public constructor () {
    super(FBEndpoint.GlobalSearch);
  }

  @action public request = ({ searchText, facets = [], limit = PAGE_SIZE, offset = 0, sort = [] }: Body): void => {
    this.set({
      method: 'post',
      body: {
        searchText,
        facets,
        limit,
        offset,
        sort,
      },
    });
  };
}

export default SearchState;
