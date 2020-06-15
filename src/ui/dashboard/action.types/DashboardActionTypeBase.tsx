import { Box, Button } from "@material-ui/core";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import React from "react";
import { Link } from "react-router-dom";
import Text from "../../components/Text";

interface Props {
  index: number;
  title: string;
  description: string;
  url: string;
  alert?: boolean;
}

export const DashboardActionTypeBase: React.FunctionComponent<Props> = ({
  index,
  title,
  description,
  url,
  alert,
  children,
}) => (
  <Box marginBottom="15px" marginTop="15px" marginLeft="45px">
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      {
        alert &&
        <span
          style={{
            backgroundColor: "#FCDEDE",
            borderRadius: 50,
            position: "absolute",
            left: 30,
            width: 35,
            height: 35,
            display: "flex",
            justifyContent: "center",
            paddingTop: 6,
          }}
        >
          <WarningOutlinedIcon color="error" fontSize="small" />
        </span>
      }
      <Link to={url} style={{ textDecoration: "none", color: "inherit" }}>
        <Box>
          <Box
            color={alert ? "error.main" : "primary.main"}
            fontWeight="fontWeightBold"
            marginBottom="5px"
          >
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
