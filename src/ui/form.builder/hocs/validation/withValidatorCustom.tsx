import _ from "lodash";
import { observer } from "mobx-react";
import React from "react";
import Validator from "validatorjs";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorDynamicProps } from "../../types/validation/validatorDialog";
import { withFBStores } from "../common/withFBStores";

export const withValidatorCustom = <T extends FBValidatorDynamicProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    dynamicValidatorStore,
    ...props
  }: T) => {
    const uniqid = require("uniqid");
    const scope = {
      Validator,
      FBValidatorStore,
    };

    React.useEffect(() => {
      dynamicValidatorStore!.setValidatorName(`validator_${uniqid()}`);
    }, []);

    const clear = () =>
      dynamicValidatorStore!.clearLiveCode();

    const transformCode = (code: string) => {
      dynamicValidatorStore!.setLiveCode(code);
      return code;
    };

    const onMessageChange = (ev: React.ChangeEvent) => {
      const value = _.get(ev.target, "value");
      dynamicValidatorStore!.setErrorMessage(value);
    };

    return Component({
      ...(props as T),
      code: dynamicValidatorStore!.liveCode,
      scope,
      transformCode,
      onMessageChange,
      clear,
    });
  };

  return (
    observer(
    withFBStores(
      (props: T) => Comp(props)),
    )
  );
};
