import { FBFormDefaultProps, FBOnChangeProps } from "../common";
import { FBSelectProps } from "../inputs/select";

export type FBValidatorSchemaSelectProps = FBSelectProps & FBFormDefaultProps & FBOnChangeProps & {
  SchemaInputType: React.ReactNode;
};
