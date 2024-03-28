import isMobile from 'is-mobile';
import { VIEWABLE_FILES } from './constants';

export const checkIfFileIsViewable = (type) => {
  if (isMobile()) {
    return false;
  }

  return VIEWABLE_FILES.includes(type?.toLowerCase());
};
