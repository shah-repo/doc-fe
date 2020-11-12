import axios from "axios";
import { filter, find, get, isEmpty, isUndefined, pick, size, sortBy, union, uniqBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import { apiClient, FBMediaAlbumFieldConstructor, FBMediaAlbumFieldMode, FBMediaAlbumFieldStore, FBMediaFile, FBMediaProps, FBMediaUrlProps, FBWorkspaceState } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";

export class FBMediaAlbumFieldState {
  @observable public loading = false;
  @observable public mode: FBMediaAlbumFieldMode = "qr";
  public filesUploaded: FBMediaProps[] = [];
  public fieldName: string | undefined;
  public isTemplate = false;
  private workspaceState?: FBWorkspaceState;

  public constructor({
    name,
    isTemplate = false,
    workspaceState,
  }: FBMediaAlbumFieldConstructor) {

    this.workspaceState = workspaceState;
    this.fieldName = name;
    this.isTemplate = isTemplate;
    this.isPreview && this.setMode("media");
    this.downloadCandidates();
  }

  public get documentId(): string | undefined {
    return this.workspaceState?.documentId;
  }

  @computed public get isPreview() {
    if (this.isTemplate) {
      return this.workspaceState?.mode !== "design";
    }
    return this.workspaceState?.mode === "preview" && this.workspaceState?.isOutput;
  }

  @computed public get collection(): FBMediaProps[] {
    const fieldImgs = FBMediaAlbumFieldStore.data.get(this.fieldName || "");
    if (fieldImgs) {
      return sortBy(uniqBy(Array.from(fieldImgs.values()), "name"), "order");
    }
    return [];
  }

  @action public setMode = (mode: FBMediaAlbumFieldMode) => set(this, "mode", mode);

  @action public upload = (files: FBMediaFile[] | undefined) => {
    if (isUndefined(files) || size(files) === 0) {
      return;
    }

    files = Array.from(files);
    const file = files.pop();
    if (!file) {
      return;
    }

    this.presignedUrl(file);
    this.upload(files);
  };

  @action public presignedUrl = (file: FBMediaFile) => {
    this.setLoading(true);
    const filename = file.name;
    const { promise } = apiClient().get(FBEndpoint.PrivateUpload, { filename });
    promise
      .then((data: FBMediaUrlProps) => {
        const presignedUrl = get(data, "url");
        if (isUndefined(presignedUrl)) {
          return;
        }
        this.uploadS3(presignedUrl, file);
      })
      .catch((_error) => this.error(_error));
  };

  @action public uploadS3 = (url: string, file: FBMediaFile) => {
    axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    })
      .then(() => this.createCandidate(url, file))
      .catch((_error) => this.error(_error));
  };

  @action public createCandidate = (url: string, file: FBMediaFile) => {
    if (!this.documentId) {
      return;
    }
    const { promise } = apiClient().post(FBEndpoint.FileUploadCandidates, {
      ...pick(file, ["name", "type"]),
      preSignedUrl: url,
      fieldNameFromSchema: this.fieldName,
      order: file.order,
      document: {
        id: this.documentId,
      },
    });

    promise
      .then(() => this.setLoading(false))
      .catch((_error) => this.error(_error));
  };

  @action public downloadCandidates = () => {
    if (!this.documentId) {
      return;
    }
    this.setLoading(true);
    const { promise } = apiClient().get(FBEndpoint.FileUploadCandidates, {
      documentId: this.documentId,
      status: "AVAILABLE",
    });

    promise
      .then((data: FBMediaProps[]) => {
        const fieldNameFromSchema = this.fieldName || "";
        const filesByName = filter(data, { fieldNameFromSchema });
        if (isEmpty(filesByName)) {
          FBMediaAlbumFieldStore.setData(this.fieldName || "", []);
          return this.setLoading(false);
        }
        this.setMode("media");
        this.download(filesByName);
      })
      .catch((_error) => this.error(_error));
  };

  @action public download = (filesUploaded: FBMediaProps[]) => {
    if (isUndefined(filesUploaded) || size(filesUploaded) === 0) {
      return this.setLoading(false);
    }

    const img = filesUploaded.pop();
    if (!img) {
      return this.setLoading(false);
    }

    const id = img.id;
    const fieldImgs = FBMediaAlbumFieldStore.data.get(this.fieldName || "");
    if (fieldImgs && fieldImgs.get(id)) {
      return this.download(filesUploaded);
    }

    if (!isUndefined(find(this.collection, { id }))) {
      return this.download(filesUploaded);
    }

    this.downloadImage(img);
    this.download(filesUploaded);
  };

  @action public downloadImage = (img: FBMediaProps) => {
    let s3link = img.s3link;
    const { promise } = apiClient().get(FBEndpoint.AssetUrl, {
      s3link,
    });

    promise
      .then((data: FBMediaUrlProps) => {
        s3link = data.url;
        const collection = union(this.collection, [{ ...img, s3link }]);
        this.fieldName && FBMediaAlbumFieldStore.setData(this.fieldName, collection);
        this.setLoading(false);
      })
      .catch((_error) => this.error(_error));
  };

  @action public removeCandidate = (mediaId: string) => {
    this.setLoading(true);
    const { promise } = apiClient().patch(`${FBEndpoint.FileUploadCandidates}/${mediaId}`, {
      status: "OBSOLETED",
    });

    promise
      .then((data: FBMediaProps) => {
        const collection = filter(this.collection, (media) => media.id !== data.id);
        this.fieldName && FBMediaAlbumFieldStore.setData(this.fieldName, collection);
        this.setLoading(false);
      })
      .catch((_error) => this.error(_error));
  };

  // TODO: format error msg & error dialog comp
  @action private error = (_error) => {
    this.setLoading(false);
    const { message } = _error;
    alert(message);
  };

  @action private setLoading = (state: boolean) => set(this, "loading", state);
}

export default FBMediaAlbumFieldState;
