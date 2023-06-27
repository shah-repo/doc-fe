import { action } from 'mobx';
import FBRequest from '../../../../ui/form.builder/FBApi/FBApi.request';
import { FBEndpoint } from '../../../../ui/form.builder/defaults/FBEndpoint';
import { PAGE_SIZE } from './helpers';

interface Body {
  searchText: string
  facets?: string[]
  limit?: number
  offset?: number
}

class SearchState extends FBRequest<any, Body> {
  public constructor () {
    super(FBEndpoint.GlobalSearch);
  }

  @action public request = async ({ searchText, facets = [], limit = PAGE_SIZE, offset = 0 }: Body): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.set(
        {
          method: 'post',
          body: {
            searchText,
            facets,
            limit,
            offset,
          },
        },
        (data, error) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        },
      );
    });
  };
}

export default SearchState;
