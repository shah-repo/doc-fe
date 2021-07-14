import { filter, find, isUndefined, map, union } from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBAttachment, FBFile, FBMediaAlbumFieldMode } from "..";
import { ATTACHMENT_ROOT_URL } from "../../../state/ducks/attachments/constants";
import { Attachment, AttachmentDownloadResponse, AttachmentType } from "../../../state/ducks/attachments/types";
import { Id } from "../../../state/ducks/common/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMediaAlbumFieldState {
  @observable public mode: FBMediaAlbumFieldMode = "qr";
  @observable public finishedUpload = false;
  public filesUploaded: FBAttachment[] = [];
  public fieldName: string | undefined;

  @observable public attachmentApi = new FBRequest<Attachment, FBFile>();
  @observable public attachmentsApi: FBRequest<FBAttachment[], null> = new FBRequest();
  @observable public collection: FBAttachment[] = [];
  @observable public attachmentDownloadApi = new FBRequest<AttachmentDownloadResponse, FBAttachment>();
  @observable public files: Id[] = [];
  public fromUpload = false;
  public filesApi: FBRequest<FBAttachment[], null> = new FBRequest();

  constructor(files: Id[] | undefined = []) {
    this.files = files;
  }

  @computed public get loading(): boolean {
    return (
      this.attachmentApi.loading ||
      this.attachmentsApi.loading ||
      this.filesApi.loading
    );
  }

  public getFiles = (ids: string[]) => this.filesApi.set({
    url: FBEndpoint.AttachmentsByIds,
    urlValues: { ids },
    method: "get",
  }, (data, error) => {
    if (data) {
      map(data, (d) => {
        const collectionIds = map(this.collection, "id");
        if (!collectionIds.includes(d.id)) {
          this.download(d);
        }
      });
      this.filesApi.onSuccess();
    }
    if (error) {
      this.filesApi.onError(error);
    }
  });

  @action public removeFile = (id: string) => {
    set(this, "files", filter(this.files, (f) => f.id !== id));
    set(this, "collection", filter(this.collection, (f) => f.id !== id));
  };

  @action public addFile = (file: FBAttachment) => {
    const files = union(this.collection, [file]);
    set(this, "collection", files);
  };

  @action public setFiles = (files: Id[]) => {
    set(this, "files", files);
  };

  public upload = (files: File[] | undefined) => {
    if (isUndefined(files) || files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }

    this.attachmentApi.set({
      url: FBEndpoint.AttachmentUpload,
      body: { file } as FBFile,
      method: "post",
    }, (data, error) => {
      if (error) {
        this.attachmentApi.onError(error);
      }
      if (data) {
        this.filesUploaded.push(data);
        this.attachmentApi.setData(data);
        this.attachmentApi.onSuccess();
      }
    });
    this.upload(files);
  };


  public downloadUploadedList = () => {
    const file = this.filesUploaded.pop();
    if (!file) {
      return;
    }
    this.download(file);
  };

  public download = (file: FBAttachment) => {
    if (isUndefined(file)) { return; }
    const queryParams = `?type=${this.attachmentType(file)}`;
    this.attachmentDownloadApi.set({
      url: `${ATTACHMENT_ROOT_URL}/${file.id}/download${queryParams}`,
      method: "get",
    }, (data, error) => {
      if (data) {
        this.addFile({
          ...file,
          url: data.url,
        });
        this.attachmentDownloadApi.setData(data);
        this.addFileId(file.id);
        this.filesApi.onSuccess();
        if (!this.filesUploaded.length) {
          this.finishedUpload = true;
        }
      }
      if (error) {
        this.attachmentDownloadApi.onError(error);
      }
    });
  };

  @action public addFileId = (id: string | undefined) => {
    if (isUndefined(id)) {
      return;
    }
    if (find(this.files, { id })) { return; }
    set(this, "files", union(this.files, [{ id }]));
  };

  private attachmentType = (file: Attachment): AttachmentType | undefined => {
    if (isUndefined(file)) { return; }
    return !file.s3linkCleanCopy
      ? AttachmentType.Attached
      : AttachmentType.CleanCopy;
  };

  @action public setMode = (mode: FBMediaAlbumFieldMode) => set(this, "mode", mode);
}

export default FBMediaAlbumFieldState;
