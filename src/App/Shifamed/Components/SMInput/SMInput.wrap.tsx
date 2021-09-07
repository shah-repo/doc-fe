import { Box } from "@material-ui/core";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { SMErrorLabel, SMInputProps, SMLabel } from "../../..";

export const withSMInput = <T extends SMInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    label,
    fullWidth = true,
    boxProps,
    rules,
    hidden,
    value,
    ...props
  }: T) => {

    // MARK: @config
    // const { formState } = SM.useStores();

    useEffect(() => {
      if (hidden) { return; }
      if (!rules) { return; }
      if (!name) { return; }
      // formState?.setRule(name, rules);
    }, [rules]);

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      if (!name) { return; }
      // hidden = formState?.hidden.get(name);
      // value = formState?.stateValues.get(name);
    });

    return (
      <>
        {!hidden && (
          <Box {...boxProps}>
            <SMLabel {...{ label }} />
            <Component
              {...props as T}
              {...{ fullWidth, value, name }}
            />
            <SMErrorLabel {...{ name }} />
          </Box>
        )}
      </>
    );
  };

  Comp.displayName = "withSMInput";
  return Comp;
};
