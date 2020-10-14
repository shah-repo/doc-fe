import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBProcedureDiffProps, FBProcedureDiffState } from "..";

export const withFBProcedureDiff = <T extends FBProcedureDiffProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleChange,
    procedureDiffState,
    checked,
    withState = true,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const initialMode = workspaceState?.mode || "none";
    procedureDiffState = FB.useRef(FBProcedureDiffState, initialMode);

    // MARK: @reactions
    // Diff switch
    React.useEffect(() => reaction(
      () => procedureDiffState?.checked,
      (checked) => {
        formState?.setFieldValue(name, checked, withState);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers

    // MARK: @methods
    handleChange = () => {
      if (!procedureDiffState) { return; }
      procedureDiffState.setChecked();
      if (procedureDiffState.checked) {
        workspaceState?.setMode("preview");
      } else {
        workspaceState?.setMode(procedureDiffState.initialMode);
      }
    }

    // MARK: @observer
    useObserver(() => {
      checked = procedureDiffState?.checked;
    });

    return Component({
      ...(props as T),
      handleChange,
      checked,
      withState,
      name,
    });
  };

  Comp.displayName = "withFBProcedureDiff";
  return Comp;
};
