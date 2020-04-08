import { FBSchemaProps } from "..";
import { FBLabelProps } from "../types/common";
import FBTestStepState from "./FBTestStep.state";

export type FBTestStepProps = Pick<FBLabelProps, "label"> & {
  testStepState?: FBTestStepState;
  schema?: FBSchemaProps[];
};
