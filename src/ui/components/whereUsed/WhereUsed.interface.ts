import { AnchorPositionType } from 'react-archer/lib/types';

export interface IWhereUsedLot {
  lhrName?: string
  lhrRevId?: string
  lhrDocumentId?: string
  displayRevision: string
  displayStatus: string
  name: string
  lotRevId: string
  childLotRevId?: string
  depth: number
}

export interface IRelation {
  targetId: string
  targetAnchor: AnchorPositionType
  sourceAnchor: AnchorPositionType
  style?: {[key: string]: string}
}

export interface IWhereUsedRequest {
  arId?: string
  lotRevIds?: string[]
  isStatusOnly: boolean
  isFirstLevelOnly: boolean
}
