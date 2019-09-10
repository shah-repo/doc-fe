export type FieldTypes = "singleLine" | "section";

export interface FieldPresenterProps {
  chosenField: FieldTypes;
  clickHandler: any;
  currentConfig?: any;
}
