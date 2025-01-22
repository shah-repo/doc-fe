import { orderBy } from 'lodash';
import { Site } from './types';

export const prepareSitesData = (list: Site[] = []) => orderBy(list, 'isPrimary', 'desc');
export const setPrimaryFieldDefaultValue = (value) => value ?? false;
