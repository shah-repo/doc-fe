export interface SMMapProps<T extends any> {
  collection: T | T[]
  children: (value: T | any, key: number | any, props: any) => React.ReactNode
}
