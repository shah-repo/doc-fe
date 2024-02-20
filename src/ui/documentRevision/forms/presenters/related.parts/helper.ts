import { RELATED_TYPE } from '../../../../../state/ducks/relatedParts/types';
import translations from '../../../../translations/en.json';

export function getDynamicTextValue (
  relatedType: RELATED_TYPE, partText: string, otherText: string): string {
  return relatedType === RELATED_TYPE.PART_RELATED ? partText : relatedType === RELATED_TYPE.OTHER_RELATED ? otherText : '';
}

export function getReplacedMessage (msg: string, replaceWord: string, replacedText: string): string {
  return (translations[msg] as string)?.replace(replaceWord, replacedText);
}

export enum RELATED_TYPE_VALUES_ENUM {
  PART= 'part',
  PART_CAPS= 'Part',
  DOCUMENT= 'document',
  DOCUMENT_CAPS= 'Document',
  SUB_PART= 'sub-part',
  SUB_PART_CAPS= 'Sub-part',
  RELATED_DOCUMENTS= 'related documents',
  SUB_DOCUMENT= 'sub-document',
  SUB_DOCUMENT_CAPS= 'Sub-document',
  BASE_PART = 'Base part',
  BASE_DOCUMENT = 'Base Document',
}
