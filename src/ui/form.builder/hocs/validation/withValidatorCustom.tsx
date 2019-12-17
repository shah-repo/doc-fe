import Base64 from "Base64";
import React from "react";
import Validator from "validatorjs";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorCustomProps } from "../../types/validation/validatorDialog";

export const withValidatorCustom = <T extends FBValidatorCustomProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({ ...props }: T) => {
    const uniqid = require("uniqid");
    const validatorName = `validator_${uniqid()}`;
    const originCode = `
      (value, req, attribute) => {
        return true;
      }
    `;

    const [liveCode, setLiveCode] = React.useState(originCode);

    const clear = () => {
      setLiveCode(originCode);
      FBValidatorStore.customValidator = undefined;
    };

    const scope = {
      Validator,
      FBValidatorStore,
    };

    const transformCode = (code: string) => {
      if (liveCode !== code) {
        setLiveCode(code);
        FBValidatorStore.customValidator = {
          name: validatorName,
          errorMessage: "Field is required",
          fn: Base64.btoa(code),
        };
      }
      return code;
    };

    return Component({
      ...(props as T),
      code: liveCode,
      scope,
      transformCode,
      clear,
    });
  };

  return (props: T) => Comp(props);
};
