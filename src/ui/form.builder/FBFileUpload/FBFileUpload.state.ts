import { filter, isUndefined, union } from "lodash";
import { action, observable, set } from "mobx";
import { Attachment } from "../../../state/ducks/attachments";
import { Id } from "../../../state/ducks/common";
import FBRequest from "../FBApi/FBApi.request";

export class FBFileUploadState {
  @observable public files: Id[] = [];

  public attachmentApi: FBRequest<Attachment, null> = new FBRequest();
  public attachmentsbyIdsApi: FBRequest<Attachment[], null> = new FBRequest();


  public constructor(files?: Attachment[]) {
    this.files = files || [];
  }

  @action public addFile = (file: Attachment | undefined) => {
    if (isUndefined(file)) {
      return;
    }
    // Not sure why we are checking s3link, it is always different
    // const includes = find(this.files, (f) => f.s3link === file.s3link);
    // isUndefined(includes) &&
    set(this, "files", union(this.files, [{ id: file.id }]));
  };

  @action public removeFile = (file: Attachment) => {
    set(this, "files", filter(this.files, (f) => f.id !== file.id));
  };
}

export default FBFileUploadState;
