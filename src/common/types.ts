// TODO after upgrading TS narrow prop keys with string literals: [key: `data-${string}`]: unknown;
export type PropsWithDataset<P> = P & { [arbitrary: string]: unknown };
