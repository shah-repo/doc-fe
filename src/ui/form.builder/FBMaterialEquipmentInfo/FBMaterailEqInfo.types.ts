interface LotItem {
  lotId: string;
  partId: string;
  quantity: number;
  unit: string;
}
interface Material {
  docId: string;
  title: string;
  revision: string;
  quantity: number;
  unit: string;
  lots: LotItem[];
}
interface Equipment {
  docId: string;
  title: string;
  nextCalibration: Date;
  nextPm: Date;
}
export interface  MaterialAndEquipment {
  equipment: Equipment[];
  materials:  Material [];
}

export interface MaterialEqProps {
  materialData: MaterialAndEquipment;
}

export interface MaterialEqContainerProps {
  documentRevisionId?: string;
}
