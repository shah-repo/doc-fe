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
}

export interface Equipment {
  docId: string;
  title: string;
  nextCalibration: Date;
  nextPm: Date;
}

export interface MaterialAndEquipment {
  equipment: Equipment[];
  materials: Material [];
}

export interface MaterialEqProps {
  materialData: MaterialAndEquipment;
}

export interface MaterialEqContainerProps {
  documentRevision?: DocumentRevision;
  inView: boolean;
}
