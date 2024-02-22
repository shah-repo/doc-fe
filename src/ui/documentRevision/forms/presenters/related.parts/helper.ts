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
  DOCUMENT= 'document',
  SUB_PART= 'sub-part',
  RELATED_DOCUMENTS= 'related documents',
  SUB_DOCUMENT= 'sub-document',
}
