import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";

interface Props {
  key: number;
  title: string;
  description: string;
  url: string;
}

export const DashboardActionTypeBase: React.FunctionComponent<Props> = ({
  key,
  title,
  description,
  url,
  children,
}) => (
  <Box marginBottom="20px" marginTop="20px">
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Box color="primary.main" fontWeight="fontWeightBold" marginBottom="5px">
          {title}
        </Box>
        <Box>
          {description}
        </Box>
      </Box>
      <Button
        variant="contained"
        target="_blank"
        href={url}
        color="secondary"
        id={`Dashboard-open-${key}`}
      >
        <Text translation="common.open" />
      </Button>
    </Box>
    {children}
  </Box>
);

export default DashboardActionTypeBase;
