import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableSupplierConfig extends SupplierConfig, EditableItem {
}

export enum SupplierTypes {
  ContractManufacturer = 'Contract Manufacturer',
  OEMDeviceSupplier ='OEM Device Supplier',
  Distributor='Distributor',
  ProductComponentSupplier ='Product Component Supplier(Custom)',
  OfftheShelfProductSupplier ='Off-the-Shelf Product Supplier',
  ManufacturingMaterials='Manufacturing Materials',
  EquipmentToolingFixtureSupplier='Equipment/Tooling/Fixture Supplier',
  ConsultantContractors='Consultant/Contractors',
  Other='Other',
}

export enum SupplierCapabilities {
  PlasticInjectionMolding= 'Plastic Injection Molding',
  MetalInjectionMolding= 'Metal Injection Molding',
  MachineShop= 'Machine Shop',
  Extrusion= 'Extrusion',
  LabelingPackaging= 'Labeling/Packaging',
  CableWireHarnesses= 'Cable/Wire Harnesses',
  PCBAssembly= 'PCB Assembly',
  Other= 'Other',
}

export enum SupplierServices {
  SterilizationServices= 'Sterilization Services',
  ComponentProcessing= 'Component Processing',
  LabTestingCalibrationServices= 'Lab/Testing/Calibration Services',
  LabelingTranslationServices= 'Labeling/Translation Services',
  ClinicalServices= ' Clinical Services',
  AuditServices= 'Audit Services',
  CertificationNotifiedBody= 'Certification/Notified Body',
  ShippingDistribution='Shipping/Distribution',
  Other= 'Other',
}

export interface optionType {
  id: string
  text: string
}

export interface SupplierConfig {
  id: string
  supplierType: optionType[]
  supplierCapabilities?: optionType[]
  supplierServices?: optionType[]
}

export interface CustomCellProps extends CellTemplateProps<EditableSupplierConfig>{
  dataOptions: optionType[]
}
