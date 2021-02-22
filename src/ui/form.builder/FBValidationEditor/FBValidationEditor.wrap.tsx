import { isUndefined } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { FBValidationEditorProps } from ".";
import { getHasPermission } from "../../../common/utils/selectors";
import { Permission } from "../../../state/ducks/auth";
import FBValidatorCustom from "../components/validation/FBValidatorCustom";
import FBValidatorForm from "../components/validation/FBValidatorForm";

export const withFBValidationEditor = <T extends FBValidationEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    config,
    ...props
  }: T) => {

    isUndefined(config) && (config = [
      {
        title: "form.builder.predefined.validation",
        content: <FBValidatorForm />,
      },
    ]);

    const customValidator = {
      title: "form.builder.custom.validation",
      content: <FBValidatorCustom/>,
    };

    const enableCustomValidator = useSelector(
      getHasPermission(Permission.FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED),
    );

    if (enableCustomValidator) {
      config.push(customValidator);
    }

    return Component({
      ...(props as T),
      config,
    });
  };

  return (props: T) => Comp(props);
};
