import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBProcedureAsset, FBProcedureProps, FBSection, FBTextEditor } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBProcedure } from "./FBProcedure.wrap";

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  ...props
}) => (
  <FBInput {...props } type="procedure">
    <FBSection label="form.builder.procedure" />
    <FBTextEditor
      name={`fb-procedure-texteditor-${props.name}`}
      label="Step #1" gutter={false}
    />
    <Box
      display="flex"
      border={1}
      borderBottom={0}
      borderRight={0}
      borderTop={0}
      borderColor={Colors.hint_gray}
      mt={1}
      ml={1.5}
    >
      <Box width={10} mr={1}>
        <Box display="flex" height="100%" flexDirection="column">
          <Box
            flexGrow={1}
            border={1}
            borderLeft={0}
            borderRight={0}
            borderTop={0}
            borderColor={Colors.hint_gray}
            mt={5}
          />
          <Box
            border={1}
            borderLeft={0}
            borderRight={0}
            borderTop={0}
            borderColor={Colors.hint_gray}
            height={1}
          />
        </Box>
      </Box>
      <Box flexGrow={1} bgcolor="white" mb={6.5} mt={2}>
        <FBProcedureAsset type="materials" />
      </Box>
    </Box>
    <Box bgcolor="white" ml={4} mt={-3.5}>
      <FBProcedureAsset type="equipment" />
    </Box>
  </FBInput>
);

export default withFBProcedure(FBProcedure);
