import { action } from 'mobx';
import FBRequest from '../../../../ui/form.builder/FBApi/FBApi.request';
import { FBEndpoint } from '../../../../ui/form.builder/defaults/FBEndpoint';
import { PAGE_SIZE } from './helpers';
import { IStoreResult } from './types';

interface Body {
  searchText: string
  facets?: string[]
  limit?: number
  offset?: number
}

class SearchState extends FBRequest<IStoreResult, Body> {
  public constructor () {
    super(FBEndpoint.GlobalSearch);
  }

  @action public request = ({ searchText, facets = [], limit = PAGE_SIZE, offset = 0 }: Body): void => {
    this.set({
      method: 'post',
      body: {
        searchText,
        facets,
        limit,
        offset,
      },
    });
  };
}

export default SearchState;
