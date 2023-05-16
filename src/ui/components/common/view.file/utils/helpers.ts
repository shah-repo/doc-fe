import { VIEWABLE_FILES } from './constants';

export const checkIfFileIsViewable = (type) => VIEWABLE_FILES.includes(type?.toLowerCase());
