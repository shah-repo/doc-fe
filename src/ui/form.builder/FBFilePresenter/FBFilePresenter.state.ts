import { includes, isUndefined, set, truncate } from "lodash";
import { FBAttachment, FBFilePresenterDownloadType } from "..";
import { Attachment, AttachmentDownloadResponse, AttachmentType } from "../../../state/ducks/attachments";
import { ATTACHMENT_ROOT_URL } from "../../../state/ducks/attachments/constants";
import { VIEWABLE_FILES, WATERMARK_FILES } from "../../components/common/view.file/utils/constants";
import FBRequest from "../FBApi/FBApi.request";

export class FBFilePresenterState extends FBRequest<AttachmentDownloadResponse, Attachment> {
  public file: FBAttachment | undefined;
  public downloadType?: FBFilePresenterDownloadType;

  public get fileId(): string | undefined {
    return this.file?.id;
  }

  public get fileType(): string | undefined {
    return this.file?.type;
  }

  public get fileName(): string {
    return this.file?.name + "." + this.fileType;
  }

  public get fileShortName(): string {
    return truncate(this.fileName, {
      length: 25,
      omission: " ...",
    });
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

  public setFile = (file: Attachment) => {
    set(this, "file", file);
  };

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

  private attachmentType = (file: Attachment): AttachmentType | undefined => {
    if (isUndefined(file)) { return; }
    return !file.s3linkCleanCopy
      ? AttachmentType.Attached
      : AttachmentType.CleanCopy;
  };
}

export default FBFilePresenterState;
