import { Box } from "@material-ui/core";
import React from "react";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import TextEditorField from "../../components/forms/fields/TextEditor";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { customHandlers, customToolbarAction, getCustomContainers } from "../utils/assessment";

type Props = Partial<FormikHybridFieldProps>;

const Assessments: React.FunctionComponent<Props> = ({ form }) => {
  const itemRenderer = () =>
    Object.values(AssessmentType).map((type) => {
      const { attachments, reasoning } = form!.values.assessments[
        type as AssessmentType
      ];

      const actionsRenderer = () => {
        if (reasoning !== null) { return; }
        return <AttachmentField name={`assessments.${type}.attachments`} />;
      };

      const hasAttachment = (attachments || []).length > 0;

      const renderTextEditor = !hasAttachment && (
        <TextEditorField
          name={`assessments.${type}.reasoning`}
          customContainers={getCustomContainers(type)}
          customHandlers={customHandlers(type)}
          customToolbarAction={customToolbarAction(type)}
          actionsRenderer={actionsRenderer}
          label={`change.request.${type}.assessment`}
        />
      );
      const renderAttachments = hasAttachment && (
        <>
          <HeaderField
            dataProp={`change.request.${type}.assessment`}
            size="sm"
            actionsRenderer={actionsRenderer}
          />
          <AttachmentIconField name={`assessments.${type}.attachments`} />
        </>
      );

      return (
        <Box key={type} mb={4}>
          {renderTextEditor}
          {renderAttachments}
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
