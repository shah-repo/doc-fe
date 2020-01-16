import { Box } from "@material-ui/core";
import React from "react";
import { AssessmentItem, AssessmentType } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import TextEditorField from "../../components/forms/fields/RichTextEditor";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import AssessmentsOptions from "./assessments.options";

type Props = Partial<FormikHybridFieldProps>;

const REASONING_OPTIONS = {
  [AssessmentType.design]: [
    {
      key: "not_affect_changes",
      value: "cr.assessment.reasoning.design.not_affect_changes",
      text: "cr.assessment.reasoning.design.not_affect_changes",
    },
    {
      key: "equivalent_changes",
      value: "cr.assessment.reasoning.design.equivalent_changes",
      text: "cr.assessment.reasoning.design.equivalent_changes",
    },
  ],
  [AssessmentType.process]: [
    {
      key: "equivalent_changes",
      value: "cr.assessment.reasoning.process.equivalent_changes",
      text: "cr.assessment.reasoning.process.equivalent_changes",
    },
  ],
  [AssessmentType.regulatory]: [
    {
      key: "no_approvals",
      value: "cr.assessment.reasoning.regulatory.no_approvals",
      text: "cr.assessment.reasoning.regulatory.no_approvals",
    },
    {
      key: "no_submissions",
      value: "cr.assessment.reasoning.regulatory.no_submissions",
      text: "cr.assessment.reasoning.regulatory.no_submissions",
    },
    {
      key: "not_certified",
      value: "cr.assessment.reasoning.regulatory.not_certified",
      text: "cr.assessment.reasoning.regulatory.not_certified",
    },
  ],
};

const Assessments: React.FunctionComponent<Props> = ({ form }) => {
  const itemRenderer = () =>
    Object.values(AssessmentType).map((type) => {
      const { attachments, reasoning }: AssessmentItem = form!.values.assessments[
        type as AssessmentType
      ];

      const actionsRenderer = () => (
        <AttachmentField name={`assessments.${type}.attachments`} />
      );

      // Has attachment
      if ((attachments || []).length > 0 && reasoning) {
        form!.setFieldValue(`assessments.${type}.reasoning`, undefined);
      }

      const reasoningOptions = REASONING_OPTIONS[type];

      return (
        <Box key={type} mb={4}>
          <TextEditorField
            name={`assessments.${type}.reasoning`}
            label={`change.request.${type}.assessment`}
            actionsRenderer={actionsRenderer}
            hidden={(attachments || []).length > 0}
            editorProps={{
              // tslint:disable-next-line: jsx-key
              toolbarCustomButtons: [<AssessmentsOptions reasoningOptions={reasoningOptions} />],
            }}
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
