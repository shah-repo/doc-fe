import { RELATED_TYPE } from '../../../../../state/ducks/relatedParts/types';

export function getDynamicTextValue (
  relatedType: RELATED_TYPE, partText: string, otherText: string): string {
  return relatedType === RELATED_TYPE.PART_RELATED ? partText : relatedType === RELATED_TYPE.OTHER_RELATED ? otherText : '';
}
