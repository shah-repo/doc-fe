import React from "react";
import { FB } from "..";
import { FBPartsProps } from "./FBParts.types";

// mock type, will be deleted
interface MockProcedureType {
  materials: string[];
  equipment: string[];
}

export const withFBParts = <T extends FBPartsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    materials,
    equipment,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const { document } = workspaceState || {};

    const procedureFields = document?.formTemplate?.schema
      .filter((field) => (field.type === "procedure" as string));
    // eslint-disable-next-line no-console
    console.log(procedureFields);

    // mock value, will be replaced with procedureFields value
    const mockValue: MockProcedureType = {
      materials: [
        "CS00001 A - Nordson (n73130), 8F OD, 55D Pebax shaft | Qty: 6 m",
        "CS00187 A - Vention (VS21839), 28mm balloon | Qty: 3 pcs",
        "CS00233 A - Qosina (M-133), Y manifold | Qty: 2pcs",
      ],
      equipment: [
        "ES00222 A - 0.010'' punch",
        "ES00333 A - 0.020'' punch",
      ],
    };


    // MARK: Reactions


    // MARK: @helpers


    // MARK: @methods

    // MARK: @observer

    return  Component({
      ...(props as T),
      equipment: mockValue.equipment,
      materials: mockValue.materials,
    });
  };

  Comp.displayName = "withFBParts";
  return Comp;
};
