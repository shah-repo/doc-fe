import { FBInputProps, FBProviderProps } from "..";

export type FBPartsProps =
& Pick<FBInputProps, "name" | "gutter" | "name">
& Pick<FBProviderProps, "partsState">;
