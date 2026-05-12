/* eslint-disable no-case-declarations */
import { filter, find, get, groupBy, isArray, last, map, some, sortBy, union } from 'lodash';
import { action, computed, set } from 'mobx';
import { FBAutocompleteAsyncConfig, FBAutocompleteAsyncConstructor, FBAutocompleteAsyncOption, FBData } from '..';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import FBAutocompleteAsyncStore from './FBAutocompleteAsync.store';

class FBAutocompleteAsyncState extends FBRequest<any, any> {
  private readonly optionId: string | undefined;
  public autocompleteValueApi: FBRequest<DocumentRevision, null> = new FBRequest();
  public additionalData?: any[];
  private readonly urlValues?: Record<string, any> = {};
  private readonly docTypeIds?: string[] = [];
  private readonly documentStatuses?: DocumentRevisionStatus[] = [];
  private readonly includePrevReleaseDoc?: boolean = false;

  public constructor ({ optionId, urlValues, docTypeIds, documentStatuses, includePrevReleaseDoc }: FBAutocompleteAsyncConstructor = {}) {
    super();
    this.urlValues = urlValues;
    this.docTypeIds = docTypeIds;
    this.documentStatuses = documentStatuses;
    this.includePrevReleaseDoc = includePrevReleaseDoc;
    this.setOptionId(optionId);
  }

  @computed public get optionsKey (): string | undefined {
    if (!this.optionId) {
      return undefined;
    }
    const keyParts = [this.optionId];
    if (this.docTypeIds?.length) {
      keyParts.push(this.docTypeIds.join(','));
    }
    if (this.optionId === FBAutocompleteAsyncOption.allDocuments && this.documentStatuses?.length) {
      keyParts.push(this.documentStatuses.join(','));
    }
    return keyParts.join('-');
  }

  public setAdditionalData = (data?: any[]) => set(this, 'additionalData', data);

  public fetchAutocompleteOption = (id: string, optionId?: string) => {
    this.autocompleteValueApi.set({
      url: FBEndpoint.FetchAutocompleteValue,
      urlValues: { id, optionId },
      method: 'get',
    });
  };

  public fetchDepricatedAutocompleteOption = (id: string) => {
    this.autocompleteValueApi.set({
      url: FBEndpoint.Document,
      urlValues: { id },
      method: 'get',
    });
  };

  @computed public get optionConfig (): FBAutocompleteAsyncConfig | undefined {
    if (!this.optionId) {
      return;
    }
    return find(FBData.autocompleteOptions, { id: this.optionId });
  }

  @computed public get sliceData (): any {
    if (!this.optionsKey) {
      return;
    }
    if (FBAutocompleteAsyncStore.data.get(this.optionsKey)) {
      return Array.from(FBAutocompleteAsyncStore.data.get(this.optionsKey).values());
    }
  }

  @action public sliceValue = (id: string | string[]): any => {
    if (!this.optionsKey) {
      return;
    }
    const options = FBAutocompleteAsyncStore.data.get(this.optionsKey);
    if (!options) {
      return;
    }
    if (!isArray(id)) {
      return options.get(id);
    }
    return Array.from(map(id, (i) => options.get(i) || i));
  };

  @action public setOptionId = (id?: string) => {
    set(this, 'optionId', id);
    this.load();
  };

  @action public load = (force = false) => {
    if (!this.optionsKey) {
      return;
    }
    const isLoading = FBAutocompleteAsyncStore.loading.get(this.optionsKey);
    if (isLoading) { return; }
    const hasData = Boolean(FBAutocompleteAsyncStore.data.get(this.optionsKey));
    if (force || !hasData) {
      this.loadInternal();
    }
  };

  @action public prepareData = (data: any): any[] | undefined => {
    if (!this.optionsKey) {
      return;
    }
    // TODO: refactore autocomplete list to reuse doc rev list (check with mobile)
    switch (this.optionId) {
      case FBAutocompleteAsyncOption.activeDocumentRevisions:
      case FBAutocompleteAsyncOption.TLList:
      case FBAutocompleteAsyncOption.CSLList:
      case FBAutocompleteAsyncOption.POList:
      case FBAutocompleteAsyncOption.suppliers:
        return map(
          groupBy(union(data, this.additionalData), 'document.docId'), (recs) => last(sortBy(recs, 'version')),
        );
      case FBAutocompleteAsyncOption.officialGroups:
        return filter(union(data, this.additionalData), { isOfficial: true });
      case FBAutocompleteAsyncOption.availablePartDocuments:
        return map([data].flat(), (doc) => ({
          ...doc,
          documentRevisions:
            some(doc.documentRevisions, ['status', DocumentRevisionStatus.Released])
              ? doc.documentRevisions : null,
          // the 0th entry is always the released / most recent released version
        })).filter((item) => item.documentRevisions);
      case FBAutocompleteAsyncOption.allDocuments:

        return map([data].flat(), (doc) => {
          const documentRevisions = this.documentStatuses?.length
            ? doc.documentRevisions?.filter((revision) => this.documentStatuses?.includes(revision.status))
            : doc.documentRevisions;

          return ({
            ...doc,
            documentRevisions,
            // the 0th entry is always the released / most recent released version
          });
        }).filter((item) => Boolean(item.documentRevisions?.length));
      case FBAutocompleteAsyncOption.docRevByDoc:
        return data.documentRevisions.map((e) => ({
          ...e,
          docId: data.docId,
        }));
      case FBAutocompleteAsyncOption.releasedParts:
        const includePrevReleaseDoc = this.includePrevReleaseDoc && this.additionalData?.length;
        let prevReleaseDocId = '';

        if (includePrevReleaseDoc) {
          prevReleaseDocId = get(this.additionalData, '[0].docId');
        }

        const checkIsItemIsReleased = (status: DocumentRevisionStatus): boolean => {
          return status === DocumentRevisionStatus.Released;
        };

        return union(
          data.filter(
            (item) => includePrevReleaseDoc
              ? item.document.docId === prevReleaseDocId || checkIsItemIsReleased(item.status)
              : checkIsItemIsReleased(item.status),
          ),
          this.additionalData ?? [],
        );
      case FBAutocompleteAsyncOption.trainingDocuments:
        return data.map((option) => {
          const latestDocRev = option?.documentRevisions.at(-1);
          return ({
            ...option,
            name: latestDocRev?.name ?? '',
            displayRevision: latestDocRev?.displayRevision ?? '',
          });
        });
      case FBAutocompleteAsyncOption.documentsEligibleForGroupTrainee:
        return data.flatMap(({ documentRevisions, ...doc }) =>
          (documentRevisions || []).map((rev) => ({
            ...doc,
            id: rev?.id,
            documentRevisionId: rev?.id,
            documentId: doc?.id,
            name: rev?.name ?? '',
            displayRevision: rev?.displayRevision ?? '',
            documentRevisions: [rev],
          })),
        );
      case FBAutocompleteAsyncOption.preventativeMaintenaceForms:
        return data.map((option) => {
          const releasedForm = option?.documentRevisions.find((e) => e.status === DocumentRevisionStatus.Released);
          return ({
            ...option,
            name: releasedForm?.name || '',
            displayRevision: releasedForm?.displayRevision || '',
          });
        });
      case FBAutocompleteAsyncOption.parts:
        return filter(union(data, this.additionalData), (item) => item.revisionChangeType !== 'OBSOLETE');
      default: return union(data, this.additionalData);
    }
  };

  public onSuccess () {
    super.onSuccess();
    if (!this.optionsKey) {
      return;
    }
    FBAutocompleteAsyncStore.loading.set(this.optionsKey, false);
    let data = this.data;
    if (!data) {
      return;
    }
    if (data.some && !data.some((value) => typeof value === 'object')) {
      data = map(this.data, (d) => ({ id: d, name: d }));
      return FBAutocompleteAsyncStore.setOptionData(this.optionsKey, data);
    }
    data.slice && FBAutocompleteAsyncStore.setOptionData(this.optionsKey, data.slice());
  }

  protected loadInternal () {
    if (!this.optionConfig || !this.optionsKey) {
      return;
    }

    FBAutocompleteAsyncStore.loading.set(this.optionsKey, true);
    const { id, root = '', publicApi } = this.optionConfig;
    const body = {
      ...(this.docTypeIds?.length ? { docTypeIds: this.docTypeIds.join(',') } : {}),
      ...(id === FBAutocompleteAsyncOption.allDocuments && this.documentStatuses?.length
        ? { documentStatuses: this.documentStatuses.join(',') }
        : {}),
    };

    this.setRoot(root);
    this.setPublicApi(publicApi as boolean);

    if (this.urlValues) {
      this.set({
        url: FBEndpoint.FetchAutocompleteValue,
        urlValues: { id: this.urlValues, optionId: id },
        method: 'get',
      });
      return;
    }
    this.set({
      url: FBEndpoint.AutocompleteByOptionId,
      urlValues: { optionId: id },
      body: Object.keys(body).length ? body : undefined,
      method: 'get',
    });
  }
}

export default FBAutocompleteAsyncState;
