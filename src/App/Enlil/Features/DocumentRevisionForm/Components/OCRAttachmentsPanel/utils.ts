import Config from '../../../../../../config';

export const isSupportedFileType = (fileType: string): boolean => {
  return Config.ocrSupportedFileTypes.includes(fileType?.toLowerCase());
};
