import { DocTypeGroups } from '../../../../ui/dashboard.new/line.items/common/types';
import { RECENTS_LIST } from './constants';

export enum RecentTypes {
  DOCUMENT = 'DOCUMENT',
  CHANGE_REQUEST = 'CHANGE_REQUEST',
}

export interface RecentItems {
  accessedAt: string
  itemType: string
  itemId: string
  docId: string
  docTitle: string
  docTypeGroup: DocTypeGroups
  docRevId?: string
}

export interface RecentsListAction {
  type: typeof RECENTS_LIST
  payload: RecentItems[]
}

export type RecentsState = RecentItems[];
