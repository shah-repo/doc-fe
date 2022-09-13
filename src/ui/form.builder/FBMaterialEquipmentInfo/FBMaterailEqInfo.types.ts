import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import useStyles from "./FBMaterialEqInfo.styles";

export enum FBMEQItemStatus {
  Removed = "removed",
  Added = "added",
  Updated = "updated",
  None = "none"
}

export interface LotItem {
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
  status?: string;
}

interface Equipment {
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
  loading?: boolean;
  handleShowDiffChange: (value: boolean) => void;
}

export interface MaterialEqContainerProps {
  documentRevision?: DocumentRevision;
  inView: boolean;
}


type MaterialEqClasses = ReturnType<typeof useStyles>;

export type MaterialItem = (Material | Equipment);
export interface PanelData {
  dataKey: string;
  title: string;
  itemComponent: React.ComponentType<MaterialItemProps> | React.ComponentType<EquipmentItemProps>;
}
export interface MaterialItemProps {
  item: Material;
  classes: MaterialEqClasses;
}
export interface EquipmentItemProps {
  item: Equipment;
  classes: MaterialEqClasses;
}
export interface PanelProps {
  panel: PanelData;
  data: Material[] | Equipment[];
  expanded: boolean;
  loading?: boolean;
  classes: MaterialEqClasses;
  togglePanel: () => void;
}
