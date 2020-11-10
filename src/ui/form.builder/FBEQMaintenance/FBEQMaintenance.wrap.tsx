import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEQMaintenanceProps } from "..";

export const withFBEQMaintenance = <T extends FBEQMaintenanceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    name = "",
    ...props
  }: T) => {

    // MARK: @config
    let isNewPMDisabled;
    const { workspaceState, formState } = FB.useStores();
    const { id: docRevId } = workspaceState || {};
    const currentStatus = formState?.getFieldValue(`${name}.status`);
    const pmFormId = formState?.inputState.get("preventativeMaintenanceForm")?.value;

    // MARK: @reactions

    // MARK: @methods
    handleAdd = () => {
      if (!docRevId && !pmFormId) { return; }
      window.open(`/document_revision/${pmFormId}/create_maintenance/${docRevId}/${name}`);
    };

    // MARK: @observer
    useObserver(() => {
      isNewPMDisabled = (
        !formState?.inputState.get("preventativeMaintenanceForm")?.value ||
        !formState?.inputState.get(`${name}.frequency`)?.value
      );
    });

    return Component({
      ...(props as T),
      handleAdd,
      isNewPMDisabled,
      name,
      currentStatus,
    });
  };

  Comp.displayName = "withFBEQMaintenance";
  return Comp;
};
