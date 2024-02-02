import { RELATED_TYPE } from '../../../../../state/ducks/relatedParts/types';
import translations from '../../../../translations/en.json';

export function getDynamicTextValue (
  relatedType: RELATED_TYPE, partText: string, otherText: string): string {
  return relatedType === RELATED_TYPE.PART_RELATED ? partText : relatedType === RELATED_TYPE.OTHER_RELATED ? otherText : '';
}

export function getReplacedMessage (msg: string, replaceWord: string, replacedText: string): string {
  return (translations[msg] as string)?.replace(replaceWord, replacedText);
}
