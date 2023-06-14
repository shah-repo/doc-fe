import { SMProviderProps } from '../../../../..';

export type DocumentRevisionFooterProps =
& Pick<SMProviderProps, '_documentRevisionFooterState'>;

export interface DocumentRevisionFooterInfo {
  version?: string
  docId?: string
  releasedAt?: string
}

export type DocumentRevisionFooterStateProps =
& DocumentRevisionFooterInfo
& {
  setInfo: (info?: DocumentRevisionFooterInfo) => void
  setHidden: (hidden: boolean) => void
  hidden: boolean
  info?: DocumentRevisionFooterInfo
};
