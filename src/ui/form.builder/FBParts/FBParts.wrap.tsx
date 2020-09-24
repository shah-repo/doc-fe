import { map, reduce } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBPartsProps, FBPartsState, FBProcedureItemConfig, FBProcedureValue } from "..";

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

    const procedures: FBProcedureValue[] = [];
    map(document?.formInput, (field, key) => {
      if (procedureFieldNames?.includes(key)) {
        const item = field;
        item.equipment = map(item.equipment, (eq) => ({
          ...eq,
          procedureFieldId: key,
        }));
        item.materials = map(item.materials, (m) => ({
          ...m,
          procedureFieldId: key,
        }));
        procedures.push(item);
      }
    });

    const getInitialValuesFromProcedures = (key: string) => reduce(
      map(procedures, (field) => field[key]),
      (eq: FBProcedureItemConfig[] = [], field) => eq.concat(field),
    );

    const partsState = FB.useRef(
      FBPartsState,
      {
        equipment: getInitialValuesFromProcedures("equipment"),
        materials: getInitialValuesFromProcedures("materials"),
      }
    );

    // MARK: Reactions
    React.useEffect(() => {
      procedureFieldNames?.map((procedureField) => {
        reaction(
          () => formState?.inputState.get(procedureField || "")?.value,
          (data) => {
            const eq = map(data.equipment, (item) => ({
              ...item,
              procedureFieldId: procedureField,
            }));
            const mat = map(data.materials, (item) => ({
              ...item,
              procedureFieldId: procedureField,
            }));
            partsState.setEquipment(eq, procedureField);
            partsState.setMaterials(mat, procedureField);
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
