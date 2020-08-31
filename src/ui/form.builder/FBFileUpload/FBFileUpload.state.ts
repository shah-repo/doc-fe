import { filter, find, isUndefined, union } from "lodash";
import { action, observable, set } from "mobx";
import { Attachment } from "../../../state/ducks/attachments";

export class FBFileUploadState {
  @observable public files: Attachment[] = [];

  public constructor(files?: Attachment[]) {
    this.files = files || [];
  }

  @action public addFiles = (files: Attachment[] | undefined) => {
    if (isUndefined(files)) {
      return;
    }
    set(this, "files", files);
  };

  @action public addFile = (file: Attachment | undefined) => {
    if (isUndefined(file)) {
      return;
    }
    const includes = find(this.files, (f) => f.s3link === file.s3link);
    isUndefined(includes) && set(this, "files", union(this.files, [file]));
  };

  @action public removeFile = (file: Attachment) => {
    set(this, "files", filter(this.files, (f) => f.id !== file.id));
  };
}

export default FBFileUploadState;
