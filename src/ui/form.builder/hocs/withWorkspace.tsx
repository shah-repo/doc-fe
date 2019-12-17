import { observer } from "mobx-react";
import React from "react";
import FBStore from "../stores/ui/FBStore";
import { FBWorkspaceProps } from "../types/workspace";
import Validator from "validatorjs";
import _ from "lodash";
import Base64 from "Base64";
import FBValidatorStore from "../stores/ui/FBValidatorStore";

export const withWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = (props: T) => {

    React.useEffect(() => {
      FBValidatorStore.customValidate();
    }, []);

    if (props.mode) {
      FBStore.setMode(props.mode);
    }
    const { schema, mode, values } = FBStore;
    const isStarter = (mode === "design" && schema.length === 0);

    if (props.id) {
      FBStore.docId = props.id;
    }

    // Validators registration
    if (FBStore.mode === "form") {
      Validator.register(
        "", () => {
          return true;
        }, "",
      );
  
      _.map(schema, (schemaItem) => {
        const { customValidator } = schemaItem;
        if (!_.isUndefined(customValidator)) {
          Validator.register(
            customValidator.name,
            // tslint:disable-next-line: no-eval
            eval(Base64.atob(customValidator.fn)),
            customValidator.errorMessage || "",
          );
        }
      });
    }

    return Component({
      ...props,
      isStarter,
      mode,
      schema,
      values,
    });
  };

  return observer((props: T) => Comp(props));
};
