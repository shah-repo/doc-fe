import { Box, Grid } from "@material-ui/core";
import React from "react";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import EditableSelectField from "../../components/forms/fields/EditableSelect/container";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { assessmentStatementOption } from "../utils/helpers";
import TextEditorField from "../../components/forms/fields/TextEditor";

type Props = Partial<FormikHybridFieldProps>;

const Assessments: React.FunctionComponent<Props> = ({ form }) => {
  const itemRenderer = () =>
    Object.values(AssessmentType).map(type => {
      const { attachments, reasoning } = form!.values.assessments[
        type as AssessmentType
      ];

      const actionsRenderer = () => (
        <AttachmentField name={`assessments.${type}.attachments`} />
      );

      // Has attachment
      if ((attachments || []).length > 0 && reasoning) {
        form!.setFieldValue(`assessments.${type}.reasoning`, undefined);
      }

      const reasoningOptions = assessmentStatementOption(type);
      const toolbarOptions = reasoningOptions.map((option) => option.value);
      const customContainers = [
        [{ assessment: toolbarOptions }],
      ];

      const customHandlers = {
        assessment(value: string) {
          const that: any = this;
          if (value) {
            that.quill.setText(value);
          }
        },
      };

      const customToolbarAction = () => {
        const placeholderPickerItems =
          Array.prototype.slice.call(document.querySelectorAll(".ql-assessment .ql-picker-item"));

        placeholderPickerItems.forEach((item) => item.textContent = item.dataset.value);

        const dropdown = document.querySelector(".ql-assessment .ql-picker-label");

        if (!dropdown) {
          return;
        }

        dropdown.innerHTML
            = "Select reasoning" + dropdown.innerHTML;
      };

      return (
        <Box key={type} mb={4}>
          <HeaderField
            dataProp={`change.request.${type}.assessment`}
            size="sm"
            actionsRenderer={actionsRenderer}
          />
          <TextEditorField
            name={`assessments.${type}.reasoning`}
            customContainers={customContainers}
            customHandlers={customHandlers}
            customToolbarAction={customToolbarAction}
          />
          <AttachmentIconField name={`assessments.${type}.attachments`} />
        </Box>
      );
    });

  return (
    <Box mb={6}>
      <Box mb={2} mt={3}>
        <HeaderField dataProp="common.assessments" />
      </Box>
      {itemRenderer()}
    </Box>
  );
};

export default withFormik<any, ChangeRequestFormValues>(Assessments);
