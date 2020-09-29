import { FBInputProps, FBProviderProps } from "..";

export type FBPartsProps =
& Pick<FBInputProps, "name">
& Pick<FBProviderProps, "partsState">;
