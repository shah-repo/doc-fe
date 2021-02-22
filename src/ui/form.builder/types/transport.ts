import { FBDialogProps } from "./dialog";

export type FBTransportSchemaProps = FBDialogProps & {
  importSchema?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exportSchema?: () => void;
  setSchemaName?: () => void;
};

export type FBImportSchemaProps = Pick<FBTransportSchemaProps, "importSchema">;
export type FBExportSchemaProps = Omit<FBTransportSchemaProps, "importSchema">;
