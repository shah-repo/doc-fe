import { filter, map } from "lodash";
import { reaction } from "mobx";
import React from "react";
import { FB, FBFieldName, FBPartsProps, FBPartsState } from "..";

export const withFBParts = <T extends FBPartsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    partsState,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    partsState = FB.useRef(FBPartsState);


    // MARK: Reactions
    // On schema change. This will register reaction for
    // each procedure added and it's value change.
    React.useEffect(() => reaction(
      () => workspaceState?.schema,
      (schema) => {
        const procedureItems = filter(schema, { type: "procedure" });
        const procedureNames = map(procedureItems, "name");
        map(procedureNames, (procedure) => {
          if (!procedure) { return; }
          if (partsState?.parts.get(procedure)) { return; }
          registerProcedureReaction(procedure);
        });
      }, {
        fireImmediately: true,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    // Register reaction on procedure value change
    function registerProcedureReaction(name: string) {
      reaction(
        () => formState?.inputState.get(name)?.value,
        (data) => partsState?.parts.set(name, data)
      );

      reaction(
        () => formState?.inputState.get(`${FBFieldName.ProcedureDiff}${name}`)?.value,
        (data) => partsState?.diffParts.set(name, data)
      );
    }

    // MARK: @methods

    // MARK: @observer

    return  Component({
      ...(props as T),
      partsState,
    });
  };

  Comp.displayName = "withFBParts";
  return Comp;
};
