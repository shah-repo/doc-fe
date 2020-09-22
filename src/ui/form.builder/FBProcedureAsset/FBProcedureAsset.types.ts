
export type FBProcedureAssetType = "materials" | "equipment";

export enum FBProcedureAssetLocale {
  materials = "form.builder.materials",
  equipment = "form.builder.equipment"
}

export enum FBProcedureAssetActionLocale {
  materials = "form.builder.add.material",
  equipment = "form.builder.add.equipment"
}

export interface FBProcedureAssetProps {
  type: FBProcedureAssetType;
}
