import { isUndefined, maxBy } from "lodash";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { FBProviderProps, FBSchemaProps } from "..";

class FB {
  public static useRef<T>(state: (new(props: any) => T), props: any = undefined): T {
    const stateRef = React.useRef<T | undefined>(undefined);
    if (isUndefined(stateRef.current)) {
      stateRef.current = new state(props);
    }
    return stateRef.current;
  }

  public static useStores() {
    return React.useContext(MobXProviderContext) as FBProviderProps;
  }

  public static get uniqid(): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const uniqid = require("uniqid");
    return uniqid();
  }

  public static stripTags(value?: string): string {
    if (!value) { return ""; }
    return value.replace(/(<([^>]+)>)/ig, "");
  }

  public static isUUID(uuid: string): boolean {
    const reUUID4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const reUUID = /^([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)$/i;
    return reUUID4.test(uuid) || reUUID.test(uuid);
  }

  public static isConsideredEmptyInput(input: Record<string, any>): boolean {
    return input == null ||
      (typeof input === "object" && Object.keys(input).length === 0) ||
      (Array.isArray(input) && input.length === 0) ||
      (typeof input !== "number" && !input);
  }

  public static calculateDateByType = (option: any, type: string) => {
    const { schema, formDocument, formInput } = option || {};

    if (!formInput) { return; }

    // Some of the EQs have predefined schema
    const opitionSchema: FBSchemaProps[] = schema || formDocument.formTemplate.schema;

    // Get all the PM or CAL fields with formInput value.
    const fieldsByType = opitionSchema.filter((field) => (
      field.type === "eqmaintenance" && field.editorConfig.type === type && formInput[field?.name as string]
    ));

    // Find oldest due date if there is more than one PM or CAL
    const oldestDueDate = maxBy(fieldsByType, (field) =>
      new Date(formInput[field?.name || ""].complianceDueDate).getTime());

    // Return oldest due date
    return formInput[oldestDueDate?.name || ""]?.complianceDueDate;
  };
}

export default FB;
