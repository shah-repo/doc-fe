import { Dictionary } from "lodash";
import { FBTemplateSchema } from "./store";

export type FBWorkspaceMode =
| "none"
| "design"
| "form"
| "preview";

export interface FBWorkspaceProps {
    mode?: FBWorkspaceMode;
    includeTransport?: boolean;
    isStarter?: boolean;
    schema?: FBTemplateSchema[];
    values?: Dictionary<any>;
}
