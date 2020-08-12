import _ from "lodash";
import { MobXProviderContext } from "mobx-react";
import React from "react";
import { FBProviderProps } from "..";

export class FB {
  public static useRef<T>(state: (new(props: any) => T), props: any = undefined): T {
    const stateRef = React.useRef<T | undefined>(undefined);
    if (_.isUndefined(stateRef.current)) {
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
}

export default FB;
