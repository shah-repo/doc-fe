import { FBConditionalWrapperProps } from "..";

const FBConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: FBConditionalWrapperProps) => condition ? wrapper(children) : children;

export default FBConditionalWrapper;
