
import { Box, CircularProgress } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FormattedMessage } from "react-intl";
import { SMTextLocaleProps, SMTextProps } from "../../..";

const SMText: React.FunctionComponent<SMTextProps> = ({
  boxProps,
  loading,
  label,
  dataCy,
}) => (
  <Box
    {...boxProps}
    data-cy={dataCy || label}
    flexDirection="row"
  >
    <Box display="flex">
      {isString(label) && (
        <FormattedMessage id={label} />
      )}
      {hasIn(label, "locale") && (
        <FormattedMessage
          id={(label as SMTextLocaleProps).locale}
          values={(label as SMTextLocaleProps).values}
        />
      )}
      {loading && (
        <Box ml={1} mt={0.3}>
          <CircularProgress color="inherit" size={16} />
        </Box>
      )}
    </Box>
  </Box>
);

export default SMText;
