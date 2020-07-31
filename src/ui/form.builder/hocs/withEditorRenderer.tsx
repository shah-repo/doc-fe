import { Box } from "@material-ui/core";
import { FormikProps } from "formik";
import _, { Dictionary } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBData } from "..";
import { isTranslation } from "../../translations/types";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent, omitLabelValidation, pickDefaultLabel } from "../defaults/editor";
import FBDynamicValidatorStore from "../stores/ui/FBDynamicValidatorStore";
import editorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBInputProps } from "../types/common";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
  (props: FormikProps<Partial<FBTemplateSchema>>) => {
    const { type, index, mode } = other;
    const InputType = FBFieldEditorComponent[type as string];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const uniqid = require("uniqid");
    const intl = useIntl();
    FBValidatorStore.setActiveValidatorType(type);
    if (_.includes(pickDefaultLabel, type) && _.isUndefined(_.get(props, "values.label"))) {
      _.set(props, "values.label", intl.formatMessage({ id: `form.builder.${type}` }));
    }

    if (type === "stepsection" || type === "teststep") {
      const stepLabel = props.values.label as string;
      const orderStr = FBStore.getSectionStepReg(stepLabel);
      orderStr && _.set(props, "values.label", stepLabel.replace(orderStr, ""));
    }

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
      const label = _.get(props, "values.label");
      if (!_.includes(omitLabelValidation, type) && !label) {
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
        index,
        name,
        ...values,
        type,
        rules,
        // applicableOn: FBValidatorStore.applicableOn ? [FBValidatorTrigger.ON_STATE_TO_IN_REVIEW] : [],
        applicableOn: ["ON_STATE_TO_IN_REVIEW"],
        customValidator,
        formValuesRules: FBValidatorStore.formValues,
        ...(type === "instructionsmediaupload" && { isTemplate: true }),
      };

      FBValidatorStore.selectedFieldIndex = null;
      FBDynamicValidatorStore.reset();
      // FBValidatorStore.applicableOn = false;
      FBValidatorStore.resetIndicatorValues();
      // FBValidatorStore.customValidator = undefined;

      const removeEl = (mode === "create") ? 0 : 1;
      let newSchema = FBStore.getSchema();
      newSchema.splice(index, removeEl, schema);
      if (type === "approval" || type === "inlineapproval") {
        newSchema.splice(index, 0, {
          type: "section",
          name: FB.uniqid,
          label: intl.formatMessage({ id: "form.builder.section" }),
        });
      }
      if (type === "inlineapproval") {
        const approvalName: string = (values as FBInputProps).name || "";
        FBStore.setValues({
          ..._.omit(FBStore.getValues(), ["approvers", "approverGroups", "approveIsBlocking"]),
          [approvalName]: _.pick(values, ["approvers", "approverGroups", "approveIsBlocking"]),
        });
        FBStore.clearSchema();
      }

      if (type === "teststep") {
        newSchema = _.union(newSchema, FBData.testStepSchema as FBInputProps[]);
      }

      FBStore.setSchema(newSchema);
      editorStore.open = false;
    };

    const buttonLabel = mode === "create"
      ? "form.builder.add.field"
      : "common.save";

    const defaulLabel = props.values.label;
    if (defaulLabel && isTranslation(defaulLabel as string)) {
      _.set(props, "values.label", intl.formatMessage({ id: defaulLabel as string }));
    }

    return (
      <Box>
        <InputType
          {..._.omit(props.values, "label")}
          {...(_.includes(pickDefaultLabel, type) && { defaultValue: _.get(props, "values.label") })}
          {...{ index, type }}
        />
        <Box display="flex" flexDirection="row-reverse" mx={-1}>
          <FBButton label={buttonLabel} onClick={onClick} />
          <FBButton label="common.cancel" onClick={editorStore.reset} />
        </Box>
      </Box>
    );
  };
