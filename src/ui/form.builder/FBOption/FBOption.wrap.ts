import { FBOptionProps } from "..";

export const withFBOption = <T extends FBOptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    options,
    optionLabelKey = "text",
    optionValueKey = "value",
    optionValueType = "key",
    ...props
  }: T) => Component({
    ...(props as T),
    options,
    optionLabelKey,
    optionValueKey,
    optionValueType,
  });

  return (props: T) => Comp(props);
};
