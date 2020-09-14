import { get, isUndefined } from "lodash";
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const uniqid = require("uniqid");

    const scope = {
      Validator,
      FBValidatorStore,
    };

    React.useEffect(() => {
      if (!isUndefined(dynamicValidatorStore?.dynamicValidator)) {
        return;
      }
      dynamicValidatorStore?.setValidatorName(`validator_${uniqid()}`);
    }, [dynamicValidatorStore, uniqid]);

    const clear = () =>
      dynamicValidatorStore?.clearLiveCode();

    const transformCode = (code: string) => {
      dynamicValidatorStore?.setLiveCode(code);
      return code;
    };

    const onMessageChange = (ev: React.ChangeEvent) => {
      const value = get(ev.target, "value");
      dynamicValidatorStore?.setErrorMessage(value);
    };

    return Component({
      ...(props as T),
      errorMessage: dynamicValidatorStore?.errorMessage,
      code: dynamicValidatorStore?.liveCode,
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
