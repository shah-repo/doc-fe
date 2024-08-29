import { LCP, LCPResponse } from '../../../ui/administration/general.settings/panels/LCP/components/Grid/types';
import { LotTransferType } from '../../../ui/form.builder/FBLotTransfers/types';
import { ThemeEnv } from '../../../ui/layout/theme/utils/types';
import { AsyncState } from '../../types';
import { GroupTag, Permission } from '../auth/types';
import { User } from '../common/types';
import { DocumentType } from '../documentRevisions/documentType/types';
import { LotStatus } from '../documentRevisions/types';
import { MaterialFlowAclRule } from '../materialFlowAcl/types';
import { AUTOSAVE_CONFIG, REDLINE_CONFIG, SELECT_COMPANY, SET_AUTOSAVE_CONFIG, SET_COMPANY_MINE, SET_GENERAL_SETTINGS, UPDATE_NAVIGATION_ITEM } from './constants';

export interface WhiteLabelingColors {
  defaultBackground: string
  primary: string
  primaryContrastText: string
  secondary: string
  secondaryContrastText: string
}

export interface WhiteLabelingEnv {
  logo: string
  avatar: string
  colors?: WhiteLabelingColors
}

export interface WhiteLabeling {
  [ThemeEnv.DEV_THEME]?: WhiteLabelingEnv
  [ThemeEnv.DEMO_THEME]?: WhiteLabelingEnv
  [ThemeEnv.SANDBOX_THEME]?: WhiteLabelingEnv
  [ThemeEnv.PRODUCTION_THEME]?: WhiteLabelingEnv
}

export interface Employee {
  id: string
  active: boolean
  company: Company
  slackUserId: string
  user?: User
}

export interface CompanyLocation {
  id: string
  name: string
  active: boolean
  includedInTotalQty: boolean
}

export interface Company {
  slackIntegrationEnabled: boolean
  id: string
  name: string
  numOfRevStages: number
  users: User[]
  documentTypes: DocumentType[]
  whiteLabeling: WhiteLabeling
  helloSignAppId: string
  helloSignIntegrationEnabled: boolean
  teamId: string
  addresses: string[]
  acctCodes: string[]
  locations: CompanyLocation[]
  navigation: NavigationItem[]
  employees?: Employee[]
  scheduledForDeletion: boolean
}

export interface SelectCompanyAction {
  type: typeof SELECT_COMPANY
  payload: Company
}

export interface CompanyMineAction {
  type: typeof SET_COMPANY_MINE
  payload: Company
  navigationMenu?: NavigationMenu
  currentEmployeeId?: string
}

export interface UpdateNavigationMenuItem {
  type: typeof UPDATE_NAVIGATION_ITEM
  payload: NavigationMenuItem
  navigationMenu?: NavigationMenu
  currentEmployeeId?: string
}

export interface CompanyMineRequest {
  name?: string
  addresses?: string[]
  acctCodes?: string[]
  helloSignIntegrationEnabled?: boolean
  navigation?: NavigationItem[]
  numOfRevStages?: number
}

export type SelectCompanyState = Company;

export type NavigationItemType = 'LINK' | 'MENU' | 'CATEGORY';

export enum NavigationItems {
  LINK = 'LINK',
  MENU = 'MENU',
  CATEGORY = 'CATEGORY',
}

export enum AllocationOrder {
  FIFO = 'fifo',
  LIFO = 'lifo',
}

export enum ExpiredLotTypes {
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotifyPartLCP {
  DO_NOTHING = 'NO',
  WARNING = 'WARN',
  ERROR = 'ERROR',
}

export interface NavigationItem {
  label: string
  type: NavigationItemType
  path?: string
  menu?: NavigationItem[]
  icon?: string
  category?: string
  restrictedToUsersWithTags?: GroupTag[]
  restrictedToUserPermissions?: Permission[]
  isOpen?: boolean
}

export interface NavigationMenu {
  id: string
  menus: NavigationMenuItem[]
}

export interface NavigationMenuItem {
  label: string
  isOpen: boolean
}

export interface AutosaveState {
  autosaveEnabled: boolean
}

export interface AutosaveAction {
  type: typeof AUTOSAVE_CONFIG
}
export interface SetAutosaveAction {
  type: typeof SET_AUTOSAVE_CONFIG
  payload: {
    active: boolean
  }
}

export interface RedlineState {
  redlineActive: boolean
}

export interface RedlineAction {
  type: typeof REDLINE_CONFIG
  payload: RedlineState
}

export interface LabelTemplatesProps {
  id: string
  name: string
}
export interface ZebraPrintSettings {
  apiKey: string
  tenantId: string
  printer: {
    sn: string
    isActive: boolean
    name: string
    labelTemplates: LabelTemplatesProps[]
  }
}

export interface EquipmentLocation {
  id: string
  name: string
  active: boolean
}

export interface ApprovalRoles {
  id: string
  name: string
  active: boolean
}

interface EquipmentFamilySettings {
  autoSyncEnabled: boolean
  locations: EquipmentLocation[]
}

enum SystemTransactionsEvent {
  CreateFromReceiving='createFromReceiving',
}

export interface SystemTransactionsRule {
  id: string
  isActive: boolean
  event: SystemTransactionsEvent
  action: LotTransferType
  from: string
  to: string | null
  lotStatus: LotStatus | null
}

interface AllocationConfig {
  sortOrderByReleaseDate: AllocationOrder
  expiredLotsPrompt: ExpiredLotTypes
}
export interface GeneralSettings {
  allocationConfig: AllocationConfig
  approvalRequestAdmin: boolean
  equipmentFamily: EquipmentFamilySettings
  isMaterialFlowAclEnabled: boolean
  lifecyclePhases?: { categories: LCPResponse[] } | LCP[]
  materialFlowACLs: MaterialFlowAclRule[]
  shouldAutoUpdateLotStatus: boolean
  shouldNotifyLcpMismatch: NotifyPartLCP
  systemTransactions: SystemTransactionsRule[]
  zebraPrint: ZebraPrintSettings[] | null
  approvalRoles: ApprovalRoles[]
}

export interface GeneralSettingsState extends GeneralSettings, AsyncState {
  id?: string
  companyId?: string
  createdAt?: string
  updatedAt?: string
}

export interface GeneralSettingsAction {
  type: typeof SET_GENERAL_SETTINGS
  payload: GeneralSettings
}
