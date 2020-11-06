import { filter, isUndefined, template, union } from "lodash";
import { action, observable, set } from "mobx";
import { Attachment } from "../../../state/ducks/attachments";
import { Id } from "../../../state/ducks/common";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBFileUploadState {
  @observable public files: Id[] = [];
  @observable public fetchedFiles: Attachment[] = [];

  public attachmentApi: FBRequest<Attachment, null> = new FBRequest();
  public attachmentsbyIdsApi: FBRequest<Attachment[], null> = new FBRequest();


  public constructor(files?: Attachment[]) {
    this.files = files || [];
  }

  public getAttachment = async (id?: string) => {
    if (!id) { return; }
    this.attachmentApi.setTemplateUrl(FBEndpoint.AttachmentById, { id });
    this.attachmentApi.fetch();
    const data = await this.attachmentApi.fetch();
    set(this, "fetchedFiles", union(this.fetchedFiles, [data]));
  };

  public getAttachments = async (ids?: string[]) => {
    if (!ids) { return; }
    const urlTpl = template(FBEndpoint.AttachmentsByIds);
    const url = urlTpl({ ids });
    this.attachmentsbyIdsApi.setUrl(url);
    this.attachmentsbyIdsApi.fetch();
    const data = await this.attachmentsbyIdsApi.fetch();
    set(this, "fetchedFiles", data);
  };

  @action public addFile = (file: Attachment | undefined) => {
    if (isUndefined(file)) {
      return;
    }
    this.getAttachment(file.id);
    // Not sure why we are checking s3link, it is always different
    // const includes = find(this.files, (f) => f.s3link === file.s3link);
    // isUndefined(includes) &&
    set(this, "files", union(this.files, [{ id: file.id }]));
  };

  @action public removeFile = (file: Attachment) => {
    set(this, "files", filter(this.files, (f) => f.id !== file.id));
    set(this, "fetchedFiles", filter(this.fetchedFiles, (f) => f.id !== file.id));
  };
}

export default FBFileUploadState;
