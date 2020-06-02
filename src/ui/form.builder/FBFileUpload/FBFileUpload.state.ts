import _ from "lodash";
import { action, observable, set } from "mobx";
import { Attachment } from "../../../state/ducks/attachments";

export class FBFileUploadState {
  @observable public files: Attachment[] = [];

  public constructor(files?: Attachment[]) {
    this.files = files || [];
  }

  @action public addFiles = (files: Attachment[] | undefined) => {
    if (_.isUndefined(files)) {
      return;
    }
    set(this, "files", files);
  };

  @action public addFile = (file: Attachment | undefined) => {
    if (_.isUndefined(file)) {
      return;
    }
    const includes = _.find(this.files, (f) => f.s3link === file.s3link);
    _.isUndefined(includes) && set(this, "files", _.union(this.files, [file]));
  };

  @action public removeFile = (file: Attachment) => {
    set(this, "files", _.filter(this.files, (f) => f.id !== file.id));
  };
}

export default FBFileUploadState;
