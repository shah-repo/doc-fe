import { filter, isUndefined, union } from 'lodash';
import { action, observable, set } from 'mobx';
import { Attachment } from '../../../state/ducks/attachments/types';
import { Id } from '../../../state/ducks/common/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';

class FBFileUploadState {
  @observable public files: Id[] = [];
  @observable public attachments: Attachment[] = [];
  @observable public unzipStatus = '';

  public attachmentApi: FBRequest<Attachment, null> = new FBRequest();
  public attachmentsbyIdsApi: FBRequest<Attachment[], null> = new FBRequest();
  public startAttachmentUnzippingApi: FBRequest<any, any> = new FBRequest();
  public getZIPStatusApi: FBRequest<any, any> = new FBRequest();

  public constructor (files?: Attachment[]) {
    this.files = files || [];
  }

  public startUnzipping = (values: {docRevisionId: string, attachmentId: string}) => {
    this.startAttachmentUnzippingApi.set({
      url: FBEndpoint.AttachmentUnzipping,
      body: values,
      method: 'post',
    });
  };

  public getZIPStatus = (attachmentId: string) => {
    this.getZIPStatusApi.set({
      url: FBEndpoint.ZIPStatus,
      urlValues: { attachmentId },
      method: 'get',
    });
  };

  @action public addFile = (file: Attachment | undefined): void => {
    if (isUndefined(file)) {
      return;
    }
    set(this, 'attachments', union(this.attachments, [file]));
    set(this, 'files', union(this.files, [{ id: file.id }]));
  };

  @action public addFiles = (files: Attachment[]): void => {
    set(this, 'attachments', union(this.attachments, files));
    set(this, 'files', union(this.files, files.map(file => ({ id: file.id }))));
  };

  @action public removeFile = (file: Attachment) => {
    set(this, 'files', filter(this.files, (f) => f.id !== file.id));
  };

  @action public removeAttachment = (id: string) => {
    set(this, 'attachments', filter(this.attachments, (f) => f.id !== id));
  };

  @action public setAttachments = (files: Attachment[]) => {
    set(this, 'attachments', files);
  };

  @action public setUnzipStatus = (status: string) => {
    set(this, 'unzipStatus', status);
  };
}

export default FBFileUploadState;
