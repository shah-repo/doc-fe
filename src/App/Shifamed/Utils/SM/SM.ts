import { isArray, isEmpty, isObject, isString, isUndefined, size } from 'lodash';
import { IReactionOptions, IReactionPublic, reaction as xReaction } from 'mobx';
import { MobXProviderContext } from 'mobx-react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SMProviderProps } from '../../..';
import { HOME_URL } from '../../../../ui/constants/urls';

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

  public static get pathname(): string {
    return useLocation().pathname;
  }

  // For the new tabpanel layout
  // This can be removed once all is refactored to new layout
  public static get isNewLayout(): boolean {
    return SM.pathname.includes('document_revision/');
  }

  // For the Update PO cases
  public static get isNewVersion(): boolean {
    return SM.pathname.includes('new-version/');
  }

  public static get isNewCRLayout(): boolean {
    return SM.pathname.includes('change_request/');
  }
  public static get isHomeURL(): boolean {
    return SM.pathname === HOME_URL;
  }
}
