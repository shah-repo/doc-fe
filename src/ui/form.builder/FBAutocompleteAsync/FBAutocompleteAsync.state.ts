/* eslint-disable no-case-declarations */
import { filter, find, get, groupBy, isArray, last, map, sortBy, union } from "lodash";
import { action, computed, set } from "mobx";
import { FBAutocompleteAsyncConfig, FBAutocompleteAsyncConstructor, FBAutocompleteAsyncOption, FBData } from "..";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import FBAutocompleteAsyncStore from "./FBAutocompleteAsync.store";

class FBAutocompleteAsyncState extends FBRequest<any, any> {
  private optionId: string | undefined;
  public autocompleteValueApi: FBRequest<DocumentRevision, null> = new FBRequest();
  public additionalData?: any[];
  private urlValues?: Record<string, any> = {};

  public constructor({ optionId, urlValues }: FBAutocompleteAsyncConstructor = {}) {
    super();
    this.urlValues = urlValues;
    this.setOptionId(optionId);
  }

  public setAdditionalData = (data?: any[]) => set(this, "additionalData", data);

  public fetchAutocompleteOption = (id: string, optionId?: string) => {
    this.autocompleteValueApi.set({
      url: FBEndpoint.FetchAutocompleteValue,
      urlValues: { id, optionId },
      method: "get",
    });
  };

  @computed public get optionConfig(): FBAutocompleteAsyncConfig | undefined {
    if (!this.optionId) {
      return;
    }
    return find(FBData.autocompleteOptions, { id: this.optionId });
  }

  @computed public get sliceData(): any {
    if (!this.optionId) {
      return;
    }
    if (FBAutocompleteAsyncStore.data.get(this.optionId)) {
      return Array.from(FBAutocompleteAsyncStore.data.get(this.optionId).values());
    }
  }

  @action public sliceValue = (id: string | string[]): any => {
    if (!this.optionId) {
      return;
    }
    const options = FBAutocompleteAsyncStore.data.get(this.optionId);
    if (!options) {
      return;
    }
    if (!isArray(id)) {
      return options.get(id);
    }
    return Array.from(map(id, (i) => options.get(i) || i));
  };

  @action public setOptionId = (id?: string) => {
    set(this, "optionId", id);
    this.load();
  };

  @action public load = (force = false) => {
    if (!this.optionId) {
      return;
    }
    const isLoading = FBAutocompleteAsyncStore.loading.get(this.optionId);
    if (isLoading) { return; }
    const hasData = Boolean(FBAutocompleteAsyncStore.data.get(this.optionId));
    if (force || !hasData) {
      this.loadInternal();
    }
  };

  @action public prepareData = (data: any): any[] | undefined => {
    if (!this.optionId) {
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
          groupBy(union(data, this.additionalData), "document.docId"), (recs) => last(sortBy(recs, "version"))
        );
      case FBAutocompleteAsyncOption.officialGroups:
        return filter(union(data, this.additionalData), { isOfficial: true });
      case FBAutocompleteAsyncOption.availablePartDocuments:
        return map([data].flat(), (doc) => ({
          ...doc,
          documentRevisions: get(doc, "documentRevisions[0]"),
        }));
      case FBAutocompleteAsyncOption.docRevByDoc:
        return data.documentRevisions.map((e) => ({
          ...e,
          docId: data.docId,
        }));
      case FBAutocompleteAsyncOption.preventativeMaintenaceForms:
      case FBAutocompleteAsyncOption.trainingDocuments:
        return data.map((option) => {
          const releasedForm = option?.documentRevisions.find((e) => e.status === DocumentRevisionStatus.Released);
          return ({
            ...option,
            name: releasedForm?.name || "",
            displayRevision: releasedForm?.displayRevision || "",
          });
        });
      case FBAutocompleteAsyncOption.parts:
        return filter(union(data, this.additionalData), (item) => item.revisionChangeType !== "OBSOLETE");
      default: return union(data, this.additionalData);
    }
  };

  public onSuccess() {
    super.onSuccess();
    if (!this.optionId) {
      return;
    }
    FBAutocompleteAsyncStore.loading.set(this.optionId, false);
    let data = this.data;
    if (!data) {
      return;
    }
    if (data.some && !data.some((value) => typeof value === "object")) {
      data = map(this.data, (d) => ({ id: d, name: d }));
      return FBAutocompleteAsyncStore.setOptionData(this.optionId, data);
    }
    data.slice && FBAutocompleteAsyncStore.setOptionData(this.optionId, data.slice());
  }

  protected loadInternal() {
    if (!this.optionConfig) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    FBAutocompleteAsyncStore.loading.set(this.optionId!, true);
    const { id, root = "", publicApi } = this.optionConfig;

    this.setRoot(root);
    this.setPublicApi(publicApi as boolean);
    if (this.urlValues) {
      this.set({
        url: FBEndpoint.FetchAutocompleteValue,
        urlValues: { id: this.urlValues, optionId: id },
        method: "get",
      });
      return;
    }
    this.set({
      url: FBEndpoint.AutocompleteByOptionId,
      urlValues: { optionId: id },
      method: "get",
    });
  }
}

export default FBAutocompleteAsyncState;

