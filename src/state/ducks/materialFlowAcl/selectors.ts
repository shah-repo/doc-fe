import { ApplicationState } from '../../reducers';
import { MaterialFlowAclRule } from './types';

const getRules = (state: ApplicationState): MaterialFlowAclRule[] => state.company.generalSettings.materialFlowAcl ?? [];

export default {
  getRules,
};
