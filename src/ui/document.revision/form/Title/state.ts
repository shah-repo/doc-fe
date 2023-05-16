import FBRequest from '../../../form.builder/FBApi/FBApi.request';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from '../../../../state/ducks/documentRevisions/constants';

export default class State {
  public searchByNameApi: FBRequest<DocumentRevision[], any> = new FBRequest();

  public searchByName = (name: string) => this.searchByNameApi.set({
    url: DOCUMENT_REVISION_SEARCH_ROOT_URL,
    method: 'post',
    body: {
      name,
      limit: 10,
    },
  });
}
