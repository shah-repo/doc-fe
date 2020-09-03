import { isUndefined, map, omit } from "lodash";
import React from "react";
import { FBFieldComponent } from "../../defaults/editor";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBTemplateSchema } from "../../types/store";
import { FBValidatorOptionProps } from "../../types/validation/validatorOption";
import { withFormik } from "../common/withFormik";
import { withIndicatorOnChange } from "../validation/withIndicatorOnChange";

export const withValidatorOption = <T extends FBValidatorOptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const component = ({
    field,
    form,
    indicators,
    indicatorOnChange,
    ...props
  }: T) => {

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (!field) {
        return;
      }
      const { name } = field;
      const { indicatorValues } = FBValidatorStore;
      const value = ev.target.checked;

      if (value) {
        form && (form.setFieldValue(name, ev.target.value));
        return FBValidatorStore.indicatorValues[name] = {};
      }
      form && (form.setFieldValue(name, ""));
      FBValidatorStore.indicatorValues = omit(indicatorValues, name);
    };

    const indicatorElements = (): React.ReactNode[] | undefined =>
      map(indicators, (
        { type, ...props }: Partial<FBTemplateSchema>,
        index,
      ) => {
        const name = `${props}${index}`;
        const InputType = FBFieldComponent[type || ""];
        return (
          <InputType
            key={`indicator-${index}-${type}`}
            name={name}
            {...props}
            onChange={indicatorOnChange}
            // fieldName={field.name}
          />
        );
      })

    // return (indicators || []).map(
    //   ({ type, ...props }: Partial<FBTemplateSchema>, index) => {
    //     if (!type) {
    //       return;
    //     }
    //     // const uuidv4 = require("uuid/v4");
    //     const name = `${field.name}${props}${index}`;
    //     const InputType = FBFieldComponent[type];
    //     return (
    //       <InputType
    //         key={`indicator-${index}-${type}`}
    //         name={name}
    //         {...props}
    //         onChange={optionOnChange(props, name)}
    //         fieldName={field.name}
    //       />
    //     );
    //   },
    // );
    ;

    function doRenderIndicators(): boolean {
      if (isUndefined(form)) {
        return false;
      }
      if (isUndefined(field)) {
        return false;
      }
      return form.values[field.name] === field.name;
    }

    return Component({
      ...(props as T),
      onChange,
      indicatorElements: doRenderIndicators() && indicatorElements,
    });
  };

  return withFormik(withIndicatorOnChange((props: T) => component(props)));
};

// export const withValidatorOption = <T extends FBValidatorOptionProps>(
//   Component: React.FunctionComponent<T>,
// ) => {
//   return withFormik((props: T) => {
//     const [checked, setChecked] = React.useState(false);
//     const { indicators, form, field } = props;

// const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
//   const { name } = field;
//   const { indicatorValues } = FBValidatorStore;
//   const value = ev.target.checked;

//   setChecked(value);
// if (value) {
//   return FBValidatorStore.indicatorValues[name] = {};
// }
// FBValidatorStore.indicatorValues = omit(indicatorValues, name);
// };

//     function isEvent(
//       value: React.ChangeEvent<HTMLInputElement>,
//     ): value is React.ChangeEvent<HTMLInputElement> {
//       return (
//         (value as React.ChangeEvent<HTMLInputElement>).target !== undefined
//       );
//     }

//     const optionOnChange = (
//       indicator: Partial<FBTemplateSchema>,
//       name: string,
//     ) => (trigger: any) => {
//       let value: any;
// const delimiter = indicator.validatorDelimiter;
// if (!delimiter) {
//   return alert("Indicator must have delimiter defined");
// }
//       switch (true) {
//         case trigger && isEvent(trigger):
//           const target = (trigger as React.ChangeEvent<HTMLInputElement>)
//             .target;
//           value = target.type === "checkbox" ? target.checked : target.value;
//           break;
//         default:
//           value = trigger;
//       }
//       form.setFieldValue(name, value);
// if (indicator.autocompleteId === "4") {
//   value = value.documentTypeAcronym;
// }
// FBValidatorStore.indicatorValues[field.name][`${delimiter}`] = value;
//     };

// const indicatorRenderer = (): React.ReactNode[] | undefined => {
//   return (indicators || []).map(
//     ({ type, ...props }: Partial<FBTemplateSchema>, index) => {
//       if (!type) {
//         return;
//       }
//       // const uuidv4 = require("uuid/v4");
//       const name = `${field.name}${props}${index}`;
//       const InputType = FBFieldComponent[type];
//       return (
//         <InputType
//           key={`indicator-${index}-${type}`}
//           name={name}
//           {...props}
//           onChange={optionOnChange(props, name)}
//           fieldName={field.name}
//         />
//       );
//     },
//   );
// };

//     return Component({
//       ...props,
//       onChange,
//       checked,
//       indicatorElements: indicatorRenderer(),
//     });
//   });
// };
