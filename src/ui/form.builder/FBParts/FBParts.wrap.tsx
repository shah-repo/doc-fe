import { map, pick, reduce } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBPartsProps, FBPartsState, FBProcedureItemConfig } from "..";

export const withFBParts = <T extends FBPartsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    materials,
    equipment,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { document } = workspaceState || {};

    const procedureFieldNames = document?.formDocument?.formTemplate?.schema
      .filter((field) => (field.type === "procedure")).map((field) => field.name);

    const fields = pick(document?.formInput, procedureFieldNames as string[]);

    const initialEquipment = reduce(
      map(fields, (field) => field.equipment),
      (eq: FBProcedureItemConfig[] = [], field) => eq.concat(field),
    );

    const initialMaterials = reduce(
      map(fields, (field) => field.materials),
      (m: FBProcedureItemConfig[] = [], field) => m.concat(field),
    );

    const partsState = FB.useRef(
      FBPartsState,
      {
        equipment: initialEquipment,
        materials: initialMaterials,
      }
    );


    // MARK: Reactions
    React.useEffect(() => {
      procedureFieldNames?.map((field) => {
        reaction(
          () => formState?.inputState.get(field || "")?.value,
          (data) => {
            partsState.setEquipment(data.equipment);
            partsState.setMaterials(data.materials);
          }
        );
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      equipment = partsState?.equipment;
      materials = partsState?.materials;
    });


    return  Component({
      ...(props as T),
      equipment,
      materials,
    });
  };

  Comp.displayName = "withFBParts";
  return Comp;
};
