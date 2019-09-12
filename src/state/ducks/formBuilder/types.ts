export interface FormBuilderFieldProps {
  order: number;
  type: string;
  closed: boolean;
  diff?: any;
  editMode: boolean;
  config: FormBuilderFieldConfig;
  onDragStart: any;
  onDragEnd: any;
}

export interface FormBuilderFieldConfig {
  colWidth: string;
  title: string;
  placeholder?: string;
  options?: any[];
  tolerance?: boolean;
  toleranceType?: string;
  max?: string;
  min?: string;
  notes?: string;
  url?: string;
  text?: string;
  textType?: string;
}

export interface HeaderState {
  title: string;
  formNumber: number;
}
