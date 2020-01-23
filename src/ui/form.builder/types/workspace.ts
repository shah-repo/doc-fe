import { Dictionary } from "lodash";
import { FBTemplateSchema } from "./store";

export type FBWorkspaceMode =
| "none"
| "design"
| "form"
| "preview";

export interface FBWorkspaceProps {
    id?: string;
    mode?: FBWorkspaceMode;
    includeTransport?: boolean;
    isStarter?: boolean;
    schema?: FBTemplateSchema[];
    values?: Dictionary<any>;
}
