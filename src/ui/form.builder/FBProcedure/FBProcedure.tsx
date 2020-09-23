import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBInput, FBProcedureItem, FBProcedureProps, FBSection, FBTextEditor } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBProvider } from "../FBProvider";
import { withFBProcedure } from "./FBProcedure.wrap";

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  handleClone,
  procedureState,
  isOutput,
  isClone,
  stepIndex,
  name,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="procedure">
    {!isClone && (
      <FBSection label="form.builder.procedure" gutter={isOutput} />
    )}
    {isOutput && (
      <FBProvider {...{ procedureState }}>
        <Box display="flex" flexDirection="row-reverse">
          <FBButton
            label="form.builder.clone.step"
            style={{ textTransform: "none", margin: 0 }}
            size="small"
            onClick={handleClone}
          />
        </Box>
        <Box mt={-1.2}>
          <FBTextEditor
            name={`fb-procedure-texteditor-${name}`}
            gutter={false}
            label={{
              locale: "form.builder.step.number",
              values: { number: stepIndex },
            }}
          />
        </Box>
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
            <FBProcedureItem type="materials" {...{ name }} />
          </Box>
        </Box>
        <Box bgcolor="white" ml={4} mt={-3.5}>
          <FBProcedureItem type="equipment" {...{ name }} />
        </Box>
      </FBProvider>
    )}
  </FBInput>
);

export default withFBProcedure(FBProcedure);
