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
  lots?: LotItem[];
  quantity: number;
  unit: string;
}
export interface  MaterialAndEquipment {
  equipment: Equipment[];
  materials:  Material [];
}

export interface MaterialEqProps {
  materialData: MaterialAndEquipment;
}
