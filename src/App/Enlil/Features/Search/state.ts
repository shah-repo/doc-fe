import { action } from 'mobx';
import FBRequest from '../../../../ui/form.builder/FBApi/FBApi.request';
import { FBEndpoint } from '../../../../ui/form.builder/defaults/FBEndpoint';
import { PAGE_SIZE } from './helpers';
import { SearchRequestBody, SearchRequestResponse } from './types';

export default class SearchState {
  public searchApi = new FBRequest<SearchRequestResponse, SearchRequestBody>(FBEndpoint.GlobalSearch);

  @action public fetchSearch = (body: SearchRequestBody): void => {
    const { searchText, facets = [], limit = PAGE_SIZE, offset = 0, sort = [] } = body;

    this.searchApi.set({
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
