import { authSelectors } from '../../state/ducks/auth';
import { Permission } from '../../state/ducks/auth/types';
import { companySelectors } from '../../state/ducks/company';
import { PremiumFeature } from '../../state/ducks/company/types';
import { tableSearchSelectors } from '../../state/ducks/tableSearch';
import { ApplicationState } from '../../state/reducers';

export const getTableCriteria = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableCriteria(reduxState, tableName);
export const getTableData = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableData(reduxState, tableName);
export const getHasPermission = (permission: Permission) => (reduxState: ApplicationState): boolean => authSelectors.getHasPermission(reduxState, permission);
export const getCurrentUserTags = () => (reduxState: ApplicationState) => authSelectors.currentEmployeeTags(reduxState);
export const hasActiveSubscription = (subscriptionType: PremiumFeature) => (reduxState: ApplicationState): boolean => companySelectors.hasActiveSubscription(reduxState, subscriptionType);
