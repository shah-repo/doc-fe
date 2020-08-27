import { isUndefined } from "lodash";
import { action } from "mobx";
import { FBFile } from ".";
import { Attachment } from "../../../state/ducks/attachments";
import { ATTACHMENT_UPLOAD_URL } from "../../../state/ducks/attachments/constants";
import FBRequest from "../FBApi/FBApi.request";

export class FBFileFieldState extends FBRequest<Attachment, FBFile> {
  public url: string = ATTACHMENT_UPLOAD_URL;

  @action public upload = (files: File[] | undefined) => {
    if (isUndefined(files) || files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }

    this.setBody({ file } as FBFile);
    this.post();
    this.upload(files);
  };
}

export default FBFileFieldState;
