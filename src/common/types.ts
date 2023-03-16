// TODO after upgrading TS narrow prop keys with string literals: [key: `data-${string}`]: string;
export type PropsWithDataset<P> = P & { [arbitrary: string]: string };
