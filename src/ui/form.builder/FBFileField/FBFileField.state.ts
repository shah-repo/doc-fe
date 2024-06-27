import { isUndefined } from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action } from 'mobx';
import { FBFile } from '..';
import { Attachment } from '../../../state/ducks/attachments/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';

class FBFileFieldState extends FBRequest<Attachment, FBFile> {
  public url: string = FBEndpoint.AttachmentUpload;

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
