import { ApplicationState } from '../../reducers';
import { MaterialFlowAclRule } from './types';

const getRules = (state: ApplicationState): MaterialFlowAclRule[] => state.company.generalSettings.materialFlowACLs ?? [];

const getIsEnabled = (state: ApplicationState): boolean => state.company.generalSettings.materialFlowAclEnabled;

export default {
  getRules,
  getIsEnabled,
};
