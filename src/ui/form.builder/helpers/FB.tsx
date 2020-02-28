import _ from "lodash";
import { MobXProviderContext } from "mobx-react";
import React from "react";

export class FB {
  public static useRef<T>(state: new () => T): T {
    const stateRef = React.useRef<T | undefined>(new state());
    return stateRef.current as T;
  }

  public static useStores() {
    return React.useContext(MobXProviderContext);
  }

  public static uniqid(): string {
    const uniqid = require("uniqid");
    return uniqid();
  }

  public static stripOption(fielddName: string, optionName?: string): string {
    if (_.isUndefined(optionName)) {
      return "";
    }
    const striped = optionName.replace(fielddName, "").replace("-<-val->", "");
    return _.startCase(striped);
  }
}

export default FB;
