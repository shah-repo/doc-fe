
export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBStateInjectedProps {
  setState: (key: keyof FBStateProps, value: any) => any;
}

export interface FBStateProps extends FBStateInjectedProps {
  initial: boolean;
}
