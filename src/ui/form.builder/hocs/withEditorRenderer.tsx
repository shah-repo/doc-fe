import { Box } from "@material-ui/core";
import { FormikProps } from "formik";
import _, { Dictionary } from "lodash";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent } from "../defaults/editor";
import FBDynamicValidatorStore from "../stores/ui/FBDynamicValidatorStore";
import editorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBEditorFormProps, omitLabelValidation } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
  (props: FormikProps<Partial<FBTemplateSchema>>) => {

    const { type, index, mode } = other;
    const InputType = FBFieldEditorComponent[type as string];
    const uniqid = require("uniqid");
    FBValidatorStore.setActiveValidatorType(type);

    // const schemaItem = (): FBTemplateSchema => ({
    //   type,
    //   index,
    //   name: uuidv4(),
    //   // rules: FBValidatorStore.getRules(),
    //   ...props.values,
    // });

    const propsByType = (): Dictionary<FBTemplateSchema | string[]> => {
      if (type === "action") {
        return { actions: _.keys(props.values) };
      }
      return props.values as FBTemplateSchema;
    };

    const onClick = () => {
      const label = _.get(props, "values.label", "");
      if (!_.includes(omitLabelValidation, type) && _.isEmpty(label)) {
        FBDynamicValidatorStore.setHelperText({
          label: ["The Label field is required."],
        });
        return;
      }

      const values = propsByType();
      let name = "";
      if (_.isObject(props.values) && _.has(props.values, "label")) {
        name = _.truncate(props.values.label as string, {
          length: 22,
          separator: " ",
        });
        name = _.kebabCase(name);
      }
      name = `${name}-${uniqid()}`;
      // const item = schemaItem();
      const customValidator = FBDynamicValidatorStore.dynamicValidator;

      let rules = FBValidatorStore.getRules();
      const customValidatorRule = customValidator && customValidator.name;
      customValidatorRule && (rules += `${!_.isEmpty(rules) ? "|" : ""}${customValidatorRule}`);

      const schema: FBTemplateSchema = {
        type,
        index,
        name,
        ...values,
        rules,
        // applicableOn: FBValidatorStore.applicableOn ? [FBValidatorTrigger.ON_STATE_TO_IN_REVIEW] : [],
        applicableOn: ["ON_STATE_TO_IN_REVIEW"],
        customValidator,
        formValuesRules: FBValidatorStore.formValues,
        ...(type === "sectionnumbering" && { label: `${values.label} #${FBStore.sectionNumbering}`}),
      };

      FBValidatorStore.selectedFieldIndex = null;
      FBDynamicValidatorStore.reset();
      // FBValidatorStore.applicableOn = false;
      FBValidatorStore.resetIndicatorValues();
      // FBValidatorStore.customValidator = undefined;

      const removeEl = (mode === "create") ? 0 : 1;
      const newSchema = FBStore.schema;
      newSchema.splice(index, removeEl, schema);
      FBStore.setSchema(newSchema);
      editorStore.open = false;
    };

    const buttonLabel = mode === "create"
      ? "form.builder.add.field"
      : "common.save";

    return (
      <Box>
        <InputType />
        <Box display="flex" flexDirection="row-reverse" mx={-1}>
          <FBButton label={buttonLabel} onClick={onClick} />
          <FBButton label="common.cancel" onClick={editorStore.reset} />
        </Box>
      </Box>
    );
  };
