import { isUndefined } from "lodash";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { FBProviderProps } from "..";
import { FBWorkspaceState } from "../FBWorkspace";

export class FB {
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

  public static getIsInputOwner( name: string, workspaceState?: FBWorkspaceState): boolean {
    const {
      document,
      externalState: { auth: { user: { employeeId = "" } = {} } = {} } = {},
    } = workspaceState || {};
    const inputOwner = document?.inputOwners?.[name];

    return inputOwner === undefined || inputOwner === employeeId;
  }
}

export default FB;
