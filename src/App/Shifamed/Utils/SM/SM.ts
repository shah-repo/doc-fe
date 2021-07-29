import { isArray, isEmpty, isObject, isString, isUndefined, size } from "lodash";
import { IReactionOptions, IReactionPublic, reaction as xReaction } from "mobx";
import { MobXProviderContext } from "mobx-react";
import React, { useEffect } from "react";
import { SMProviderProps } from "../../..";

export default class SM {

  public static useRef<T>(store: (new(props: any) => T), props: any = undefined): T {
    const stateRef = React.useRef<T | undefined>(undefined);
    if (isUndefined(stateRef.current)) {
      stateRef.current = new store(props);
    }
    return stateRef.current;
  }

  public static useStores() {
    return React.useContext(MobXProviderContext) as SMProviderProps;
  }

  public static isValue(value: any): boolean {
    switch (true) {
      case isString(value):
      case isObject(value):
        return !(isUndefined(value) || isEmpty(value));
      case isArray(value):
        return !(isUndefined(value) || size(value) === 0);
      default:
        return !isUndefined(value);
    }
  }

  public static reaction<T>(
    expression: (r: IReactionPublic) => T,
    effect: (arg: T, r: IReactionPublic) => void,
    opts?: IReactionOptions
  ) {
    if (!expression) { return; }
    useEffect(() => {
      xReaction<T>(expression, effect, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }
}
