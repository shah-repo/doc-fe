import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export interface LotItem {
  lotId: string;
  partId: string;
  quantity: number;
  unit: string;
}

export interface Material {
  docId: string;
  title: string;
  revision: string;
  quantity: number;
  unit: string;
  lots: LotItem[];
  status?: string;
}

export interface Equipment {
  docId: string;
  title: string;
  nextCalibration: Date;
  nextPm: Date;
  status?: string;
}

export interface MaterialAndEquipment {
  equipment: Equipment[];
  materials: Material[];
}

export interface MaterialEqProps {
  materialData: MaterialAndEquipment;
  includeDiff: boolean;
  showDiff: boolean;
  handleShowDiffChange: (value: boolean) => void;
}

export interface MaterialEqContainerProps {
  documentRevision?: DocumentRevision;
  inView: boolean;
}
