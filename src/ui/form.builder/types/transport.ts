import { FBDialogProps } from "./dialog";

export interface FBTransportSchemaProps extends FBDialogProps {
    importSchema(event: React.ChangeEvent<HTMLInputElement>): void;
    exportSchema(): void;
    setSchemaName(): void;
}

export type FBTransportSchemaInjectedProps = Pick<FBTransportSchemaProps,
    | "importSchema"
    | "exportSchema"
    | "setSchemaName"
>;
export type FBImportSchemaProps = Pick<FBTransportSchemaProps, "importSchema">;
export type FBExportSchemaProps = Omit<FBTransportSchemaProps, "importSchema">;
