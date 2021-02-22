import { includes, isUndefined, set, truncate } from "lodash";
import { action, observable, reaction } from "mobx";
import { FBAttachment, FBFilePresenterDownloadType } from "..";
import { Attachment, AttachmentDownloadResponse, AttachmentType, ATTACHMENT_ROOT_URL } from "../../../state/ducks/attachments";
import { VIEWABLE_FILES, WATERMARK_FILES } from "../../components/common/view.file/utils/constants";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBFilePresenterState extends FBRequest<AttachmentDownloadResponse, Attachment> {
  @observable public toolsVisible?: boolean;
  public file?: FBAttachment;
  public downloadType?: FBFilePresenterDownloadType;

  public attachmentApi: FBRequest<FBAttachment, Partial<FBAttachment>> = new FBRequest();

  constructor(file?: FBAttachment) {
    super();
    this.file = file;

    reaction(
      () => this.attachmentApi.loading,
      (loading) => (this.loading = loading),
    );
  }

  @action public setToolsVisible = (state: boolean) => {
    set(this, "toolsVisible", state);
  };

  public get fileId(): string | undefined {
    return this.file?.id;
  }

  public get fileType(): string | undefined {
    return this.file?.type;
  }

  public get fileName(): string {
    return `${this.file?.name}.${this.fileType}`;
  }

  public get fileShortName(): string {
    return truncate(this.fileName, {
      length: 50,
      omission: " ...",
    });
  }

  public get fileSize(): number | undefined {
    return this.file?.fileSizeS3Link;
  }

  public get isCleanCopy(): boolean {
    return Boolean(this.file?.s3linkCleanCopy);
  }

  public get isFileViewable(): boolean {
    return includes(VIEWABLE_FILES, this.fileType?.toLowerCase());
  }

  public get canWatermark(): boolean {
    return includes(WATERMARK_FILES, this.fileType);
  }

  public setDownloadType = (type: FBFilePresenterDownloadType) => {
    this.downloadType = type;
    if (this.file?.url) { return; }
    this.download();
  };

  public download = () => {
    if (isUndefined(this.file)) { return; }
    const queryParams = `?type=${this.attachmentType(this.file)}`;
    this.url = `${ATTACHMENT_ROOT_URL}/${this.fileId}/download${queryParams}`;
    this.fetch();
  };

  public patchFile = (values: Partial<FBAttachment>) => {
    const { id } = this.file || {};
    if (!id) { return; }
    this.attachmentApi.set({
      url: FBEndpoint.AttachmentPatch,
      urlValues: { id },
      body: values,
      method: "patch",
    });
  };

  private attachmentType = (file: Attachment): AttachmentType | undefined => {
    if (isUndefined(file)) { return; }
    return !file.s3linkCleanCopy
      ? AttachmentType.Attached
      : AttachmentType.CleanCopy;
  };
}

export default FBFilePresenterState;
