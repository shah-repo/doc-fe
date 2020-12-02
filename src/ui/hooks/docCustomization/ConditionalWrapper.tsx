import { ConditionalWrapperProps } from "./types";

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => condition ? wrapper(children) : children;

export default ConditionalWrapper;
