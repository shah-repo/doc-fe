import { Box, Button } from "@material-ui/core";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";

interface Props {
  index: number;
  title: string;
  description: string;
  url: string;
  alert?: boolean;
  alertMessage?: string;
}

const DashboardActionTypeBase: React.FunctionComponent<Props> = ({
  index,
  title,
  description,
  url,
  alert,
  alertMessage,
  children,
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <Box
      m="15px 0 15px 45px"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {
          alert &&
          <span
            style={{
              backgroundColor: isHover ? Colors.light_red : "",
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
              {title}{alertMessage}
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
};

export default DashboardActionTypeBase;
