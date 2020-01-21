import React from "react";

export class FB {
  public static useRef<T>(state: (new() => T)): T {
    const stateRef = React.useRef<T | undefined>(new state());
    return stateRef.current as T;
  }
}

export default FB;
