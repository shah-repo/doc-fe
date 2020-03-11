export interface FBMapWrapperProps<T> {
  collection: T[];
  children: (item: T, index: number, props: any) => React.ReactNode;
}
