
export type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;

export interface FBLabelRendererProps  {
  labelRenderer?: JSX.Element;
}

export type FBFormDefaultProps = FBLabelRendererProps & {
  label?: string;
};
