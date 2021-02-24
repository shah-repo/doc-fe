import { Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { DataProps, TypographyColor, TypographyProps, TypographySize } from "../../../../state/ducks/common/types";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import { styles } from "./utils/styles";
import { HeaderFieldProps } from "./utils/types";

type Props = DataProps<Translation | string> &
HeaderFieldProps &
Partial<TypographyProps>;

const HeaderField: React.FunctionComponent<Props> = ({
  dataProp,
  size = "md",
  variant = "h6",
  color = "primary",
  actionsRenderer,
}) => {
  const classes = styles({ size, color });

  return (
    <Toolbar disableGutters={true} className={classes.toolbar} id="HeaderField-toolbar">
      <Typography
        variant={TypographySize[size]}
        color={TypographyColor[color]}
        gutterBottom={true}
        style={{ flex: 1 }}
      >
        <Text message={dataProp} />
      </Typography>
      {actionsRenderer && actionsRenderer()}
    </Toolbar>
  );
};

export default HeaderField;
