export type ModuleOrSubModule = "Module" | "Sub-Module";
export const REQ_HEADER_TEXT = "REQ #";
export const fileWriteEncoding = { encoding: "UTF-8" };

export interface FilesWithData {
  [key: string]: {
    fileContent: object;
    reqsList: string[];
  };
}
