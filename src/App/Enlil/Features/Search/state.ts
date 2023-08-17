import { action } from 'mobx';
import FBRequest from '../../../../ui/form.builder/FBApi/FBApi.request';
import { FBEndpoint } from '../../../../ui/form.builder/defaults/FBEndpoint';
import { PAGE_SIZE } from './helpers';
import { SearchRequestBody, SearchRequestResponse } from './types';
import { TrainingRecordQuery } from '../../../../state/ducks/training/types';

export default class SearchState {
  public searchApi = new FBRequest<SearchRequestResponse, SearchRequestBody>(FBEndpoint.GlobalSearch);
  public trainingApi = new FBRequest<TrainingRecordQuery, never>(FBEndpoint.TrainingRecord);

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

  @action public fetchTrainingRecord = (id: string): void => {
    this.trainingApi.set({
      url: `${FBEndpoint.TrainingRecord}/${id}`,
      method: 'get',
    });
  };

  @action public reset = (): void => {
    this.searchApi.data = undefined;
    this.trainingApi.data = undefined;
  };
}
