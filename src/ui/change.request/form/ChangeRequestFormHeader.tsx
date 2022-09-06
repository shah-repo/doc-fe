import { Box } from "@material-ui/core";
import React from "react";
import Title from "../../document.revision/form/title";
import Description from "../../documentRevision/forms/presenters/Description";

interface ChangeRequestFormHeaderProps {
  title?: string;
  description?: string;
  isDisabledInput?: boolean;
  documentTypeId?: string;
}

const ChangeRequestFormHeader: React.FunctionComponent<ChangeRequestFormHeaderProps> = ({
  title,
  description,
  isDisabledInput,
  documentTypeId,
}) =>  (
  <Box id="SMHeaderTmpl"
    paddingTop={0.25}
    paddingBottom={1.25}
    pl={3.75}
    pr={4.25}
  >
    <Box paddingBottom={1.25}>
      <Title
        name="title"
        documentTypeId={documentTypeId}
        disabled={isDisabledInput}
        value={title}
      />
    </Box>
    <Description
      isQms={false}
      documentTypeId={documentTypeId}
      isDisabled={isDisabledInput}
    />
  </Box>
);

export default ChangeRequestFormHeader;
