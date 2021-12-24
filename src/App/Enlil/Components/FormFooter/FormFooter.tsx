import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { FormFooterProps } from "../../..";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withFormFooterWrap } from "./FormFooter.wrap";


const FormFooter: React.FunctionComponent<FormFooterProps> = ({
  _formFooterState,
  boxProps,
  children,
}) =>  (
  <Observer>
    {() => (
      <Box
        py={2.5}
        display={_formFooterState?.hidden ? "none" : "flex"}
        justifyContent="center"
        alignItems="center"
        bgcolor={Colors.light_gray}
        {...boxProps}
      >
        {children}
      </Box>
    )}
  </Observer>
);

export default withFormFooterWrap(FormFooter);
