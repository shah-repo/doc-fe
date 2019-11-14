import { Dictionary } from "lodash";
import { FBFormDefaultProps } from "./common";
import { FBTemplateSchema } from "./store";

export type FBValidatorProps = Pick<FBFormDefaultProps, "schema">;

export interface FBValidatorMetaProps {
    fieldKey: string;
}

export interface FBValidatorInstanceProps {
    type: string;
    validatorMetadata: FBValidatorMetaProps;
    props: Partial<FBTemplateSchema>;
}

export interface FBValidatorRestProps {
    name: string;
    fields: Dictionary<string>;
}
