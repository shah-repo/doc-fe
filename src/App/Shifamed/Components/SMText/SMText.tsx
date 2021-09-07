
import { Box, CircularProgress } from "@material-ui/core";
import { hasIn, isString } from "lodash";
import React from "react";
import { FormattedMessage } from "react-intl";
import { SMTextLocaleProps, SMTextProps } from "../../..";

const SMText: React.FunctionComponent<SMTextProps> = ({
  boxProps,
  loading,
  locale,
  dataCy,
}) => (
  <Box
    {...boxProps}
    data-cy={dataCy || locale}
    flexDirection="row"
  >
    <Box display="flex">
      {isString(locale) && (
        <FormattedMessage id={locale} />
      )}
      {hasIn(locale, "locale") && (
        <FormattedMessage
          id={(locale as SMTextLocaleProps).locale}
          values={(locale as SMTextLocaleProps).values}
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
