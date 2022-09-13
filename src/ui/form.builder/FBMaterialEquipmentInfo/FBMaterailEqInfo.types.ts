import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Colors from "../../layout/theme/utils/colors";

export enum FBMEQItemStatus {
  Removed = "removed",
  Added = "added",
  Updated = "updated",
  None = "none"
}

export const FBMEQItemStatusBorder: Record<FBMEQItemStatus, Colors> = {
  [FBMEQItemStatus.Removed]: Colors.opal_red,
  [FBMEQItemStatus.Added]: Colors.light_green,
  [FBMEQItemStatus.Updated]: Colors.gray,
  [FBMEQItemStatus.None]: Colors.medium_blue,
};

export const FBMEQItemStatusBg: Record<FBMEQItemStatus, Colors> = {
  [FBMEQItemStatus.Removed]: Colors.medium_red,
  [FBMEQItemStatus.Added]: Colors.pale_green,
  [FBMEQItemStatus.Updated]: Colors.platinum_gray,
  [FBMEQItemStatus.None]: Colors.light_blue,
};

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
  loading?: boolean;
  handleShowDiffChange: (value: boolean) => void;
}

export interface MaterialEqContainerProps {
  documentRevision?: DocumentRevision;
  inView: boolean;
}
