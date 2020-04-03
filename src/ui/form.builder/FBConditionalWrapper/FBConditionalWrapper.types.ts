export interface FBConditionalWrapperProps {
  condition?: boolean;
  wrapper: (children: React.ReactNode | React.ReactNode[]) => any;
  children: React.ReactNode | React.ReactNode[];
}
