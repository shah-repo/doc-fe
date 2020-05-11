import _, { set } from "lodash";
import { action, computed } from "mobx";
import { Attachment, AttachmentDownloadResponse, AttachmentType } from "../../../state/ducks/attachments";
import { ATTACHMENT_ROOT_URL } from "../../../state/ducks/attachments/constants";
import { VIEWABLE_FILES, WATERMARK_FILES } from "../../components/common/view.file/utils/constants";
import FBRequest from "../FBApi/FBApi.request";

export class FBFilePresenterState extends FBRequest<AttachmentDownloadResponse, Attachment> {

  @computed public get fileId(): string | undefined {
    return this.file?.id;
  }

  @computed public get fileType(): string | undefined {
    return this.file?.type;
  }

  @computed public get fileName(): string {
    return this.file?.name + "." + this.fileType;
    // `${this.file?.name}.${this.fileType}` || "";
  }

  @computed public get fileShortName(): string {
    return _.truncate(this.fileName, {
      length: 25,
      omission: " ...",
    });
  }

  @computed public get isCleanCopy(): boolean {
    return Boolean(this.file?.s3linkCleanCopy);
  }

  @computed public get isFileViewable(): boolean {
    return _.includes(VIEWABLE_FILES, this.fileType);
  }

  @computed public get canWatermark(): boolean {
    return _.includes(WATERMARK_FILES, this.fileType);
  }
  public file: Attachment | undefined;

  @action public setFile = (file: Attachment) => {
    set(this, "file", file);
  };

  @action public download = () => {
    if (_.isUndefined(this.file)) {
      return;
    }
    const queryParams = `?type=${this.attachmentType(this.file)}`;
    this.url = `${ATTACHMENT_ROOT_URL}/${this.fileId}/download${queryParams}`;
    this.fetch();
  };

  @action public onSuccess = () => {
    if (_.isUndefined(this.data)) {
      return;
    }
    window.onbeforeunload = null;
    window.open(this.data.url, "_parent");
  };

  @action public watermakDownload = () => {
    alert("Not Implemented");
  };

  @action public viewFile = () => {
    alert("Not Implemented");
  };

  @action private attachmentType = (file: Attachment): AttachmentType | undefined => {
    if (_.isUndefined(file)) {
      return;
    }
    return !file.s3linkCleanCopy
      ? AttachmentType.Attached
      : AttachmentType.CleanCopy;
  };
}

export default FBFilePresenterState;
