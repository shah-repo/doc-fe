import { Box, Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Text from "../../components/Text";

interface Props {
  index: number;
  title: string;
  description: string;
  url: string;
}

export const DashboardActionTypeBase: React.FunctionComponent<Props> = ({
  index,
  title,
  description,
  url,
  children,
}) => (
  <Box marginBottom="15px" marginTop="15px">
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
        <Box>
          <Box color="primary.main" fontWeight="fontWeightBold" marginBottom="5px">
            {title}
          </Box>
          <Box>
            {description}
          </Box>
        </Box>
      </Link>
      <Button
        variant="contained"
        target="_blank"
        href={url}
        color="secondary"
        id={`Dashboard-open-${index}`}
      >
        <Text translation="common.open" />
      </Button>
    </Box>
    {children}
  </Box>
);

export default DashboardActionTypeBase;
