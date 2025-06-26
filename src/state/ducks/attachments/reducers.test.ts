import { SET_ENTRY_PART_PROGRESS } from './constants';
import reducer from './reducers';
import { AttachmentUploadAction, AttachmentUploadEntryStatus, AttachmentUploadState, EntryUploadPart, UploadUrl } from './types';

describe('attachments reducers tests', () => {
  describe('SET_UPLOAD_PART_PROGRESS action', () => {
    const uploadId = 'test-upload-id';
    const partNumber = 1;
    const uploadedBytes = 1024;

    const uploadUrl: UploadUrl = {
      partNumber: 1,
      url: 'https://example.com/upload',
    };

    const uploadPart: EntryUploadPart = {
      ...uploadUrl,
      eTag: 'test-etag',
      uploaded: 512, // initial uploaded bytes
      lastUpdate: Date.now(),
    };

    const uploadState: AttachmentUploadState = {
      queue: [
        {
          id: uploadId,
          file: new File(['test'], 'test.txt'),
          status: AttachmentUploadEntryStatus.Uploading,
          retries: 0,
          numberOfParts: 2,
          attachmentMetadata: {
            lineType: 'CLEAN_COPY',
            index: 1,
          },
          stats: {
            uploaded: 0,
            speed: 0,
            eta: 0,
            lastUpdate: Date.now(),
            progress: 0,
          },
          session: {
            key: 'test-key',
            uploadId: 'test-upload-id',
            parts: [uploadPart, { ...uploadUrl, partNumber: 2, uploaded: 0, lastUpdate: Date.now() }],
          },
        },
      ],
      stats: {
        speed: 0,
        eta: 0,
        lastUpdate: Date.now(),
        uploaded: 0,
      },
    };

    const initialState = {
      watermarks: [],
      uploads: uploadState,
    };

    const action: AttachmentUploadAction = {
      type: SET_ENTRY_PART_PROGRESS,
      payload: {
        id: uploadId,
        partNumber,
        uploaded: uploadedBytes,
      },
    };

    it('updates the uploaded bytes for the specified part', () => {
      const newState = reducer(initialState, action);
      const updatedEntry = newState.uploads.queue.find(entry => entry.id === uploadId);

      expect(updatedEntry).toBeDefined();
      expect(updatedEntry?.session?.parts).toBeDefined();

      const updatedPart = updatedEntry?.session?.parts.find(part => part.partNumber === partNumber);
      expect(updatedPart).toBeDefined();
      expect(updatedPart?.uploaded).toBe(uploadedBytes);
    });

    it('does not affect other parts', () => {
      const newState = reducer(initialState, action);
      const updatedEntry = newState.uploads.queue.find(entry => entry.id === uploadId);

      const otherPart = updatedEntry?.session?.parts.find(part => part.partNumber === 2);
      expect(otherPart?.uploaded).toBe(0);
    });

    it('does not affect other upload entries', () => {
      const otherUploadId = 'other-upload-id';
      const stateWithMultipleUploads = {
        watermarks: [],
        uploads: {
          ...uploadState,
          queue: [
            ...uploadState.queue,
            {
              id: otherUploadId,
              file: new File(['other'], 'other.txt'),
              status: AttachmentUploadEntryStatus.Uploading,
              retries: 0,
              numberOfParts: 1,
              attachmentMetadata: {
                lineType: 'CLEAN_COPY',
                index: 2,
              },
              stats: {
                uploaded: 0,
                speed: 0,
                eta: 0,
                progress: 0,
                lastUpdate: Date.now(),
              },
              session: {
                key: 'other-key',
                uploadId: 'other-upload-id',
                parts: [{ ...uploadUrl, partNumber: 1, uploaded: 0, lastUpdate: Date.now() }],
              },
            },
          ],
        },
      };

      const newState = reducer(stateWithMultipleUploads, action);
      const otherEntry = newState.uploads.queue.find(entry => entry.id === otherUploadId);

      expect(otherEntry?.session?.parts[0].uploaded).toBe(0);
    });

    it('handles case when session is undefined', () => {
      const stateWithoutSession = {
        watermarks: [],
        uploads: {
          ...uploadState,
          queue: [
            {
              ...uploadState.queue[0],
              session: undefined,
            },
          ],
        },
      };

      const newState = reducer(stateWithoutSession, action);
      const updatedEntry = newState.uploads.queue.find(entry => entry.id === uploadId);

      expect(updatedEntry?.session).toBeUndefined();
    });

    it('handles case when part number does not exist', () => {
      const actionWithNonExistentPart: AttachmentUploadAction = {
        type: SET_ENTRY_PART_PROGRESS,
        payload: {
          id: uploadId,
          partNumber: 999, // non-existent part number
          uploaded: uploadedBytes,
        },
      };

      const newState = reducer(initialState, actionWithNonExistentPart);
      const updatedEntry = newState.uploads.queue.find(entry => entry.id === uploadId);

      // Should not add a new part, should leave existing parts unchanged
      expect(updatedEntry?.session?.parts).toHaveLength(2);
      expect(updatedEntry?.session?.parts.find(part => part.partNumber === 999)).toBeUndefined();
    });
  });
});
