import { DocumentRevisionOption } from './types';

export const getOptionLabel = (option: DocumentRevisionOption): string => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};
