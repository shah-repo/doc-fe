import { FBFormDefaultProps } from "./common";
import { FBTemplateSchema } from "./store";
import { Dictionary } from "lodash";

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
