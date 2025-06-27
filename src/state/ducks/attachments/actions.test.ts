/* eslint-disable @typescript-eslint/unbound-method */
import { attachmentsActions } from '.';
import CallbackHandler from '../../../common/callbackHandler';
import { getCallbackHandler } from '../../../common/tests/factories';
import { Handlers } from '../../types';
import { formatFileSize } from './actions';
import { ATTACHMENT_ROOT_URL, LINE_TYPES } from './constants';
import { Attachment, AttachmentDownloadResponse } from './types';

describe('attachemnt actions tests', () => {
  describe('formatFileSize tests', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1023)).toBe('1023 B');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatFileSize(1024 * 1024 * 1024 - 1)).toBe('1024.0 MB');
    });

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });
  });

  describe('upload action tests', () => {
    const handlers: Handlers<Attachment> = {
      successHandler: getCallbackHandler<Attachment>(),
      errorHandler: getCallbackHandler<string>(),
      setCancelToken: () => true,
    };
    const file: File = new File(['abc'], 'test.file');

    const uploadHandler: CallbackHandler<Attachment> = new CallbackHandler();
    uploadHandler.execute = jest.fn();
    const attachment: Attachment = {
      id: 'sdasd-1-e-asd-d',
      name: 'Title',
      type: 'SOC',
      s3link: 'https://mylink.com',
      lineType: LINE_TYPES.CLEAN_COPY,
      fileSizeS3Link: 1,
      hasWatermarks: false,
      fileSizeS3LinkCleanCopy: 1,
      index: 1,
    };

    it('creates upload action with correct parameters', () => {
      const action = attachmentsActions.upload(file, attachment.lineType ?? '', Number(attachment.index), handlers);
      expect(action).toBeDefined();
    });
  });

  describe('download action tests', () => {
    const handlers: Handlers<AttachmentDownloadResponse> = {
      successHandler: getCallbackHandler<AttachmentDownloadResponse>(),
      errorHandler: getCallbackHandler<string>(),
      setCancelToken: () => true,
    };

    const attachment: Attachment = {
      id: 'ki23jrlo2i3jr;',
      name: 'Title',
      type: 'SOC',
      s3link: 'https://mylink.com',
      lineType: LINE_TYPES.CLEAN_COPY,
      fileSizeS3Link: 1,
      hasWatermarks: false,
      fileSizeS3LinkCleanCopy: 1,
    };

    const action = attachmentsActions.download(attachment, handlers);

    it('calls GET on ATTACHMENT_ROOT_URL/id/download', () => {
      expect(action.url).toBe(`${ATTACHMENT_ROOT_URL}/${attachment.id}/download`);
      expect(action.method).toBe('get');
    });

    it('calls successHandler.execute on success', () => {
      const response: AttachmentDownloadResponse = { url: 'ASDASDSA' };
      action.onSuccess(response, jest.fn());
      expect(handlers.successHandler.execute).toHaveBeenCalledWith(response);
    });

    it('calls errorHandler.execute on error', () => {
      const error = 'CANNOT FETCH DOWNLOAD URL';
      action.onFailure(error, jest.fn());
      expect(handlers.errorHandler.execute).toHaveBeenCalledWith(error);
    });
  });
});
