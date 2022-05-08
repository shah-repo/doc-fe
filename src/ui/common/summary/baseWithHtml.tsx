import { Box, Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { truncate } from "lodash";
import React, { useEffect, useState } from "react";
import { convertHtmlEntities } from "../../../common/utils/helpers";
import Text from "../../components/Text";
import styles from "./styles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
  labelProps,
  labelFont,
}) => {
  const [editor, setEditor] = useState<string>();
  const [btnText, setBtnText] = useState("view more");
  const [flag, setFlag] = useState(false);
  const editedValue = value ? convertHtmlEntities(value.replace(/(<([^>]+)>|\/n)/g, "")) : "";
  useEffect(() => {
    getTruncatText();
  }, []);

  const completeText = () => {
    setEditor(editedValue);
  };

  const getTruncatText = () => {
    const truncatedText = truncate(editedValue, {
      length: 50,
      separator: " ",
    });
    setEditor(truncatedText);
  };

  const toggleBtn = () => {
    setFlag(!flag);
    if (flag) {
      getTruncatText();
      setBtnText("view more");
    } else {
      completeText();
      setBtnText("view less");
    }
  };

  return (
    <Grid item={true} xs={12} style={{ marginBottom: "-24px" }} >
      {label && (
        <Grid item={true} xs={12} id="BaseWithhtml-label">
          <Typography style={labelProps}>
            <Text message={label} />
          </Typography>
        </Grid>
      )}
      <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
        <Box className={classes.descriptionContainer} >
          <table>
            <tr>
              <td>
                <span
                  style = { { fontSize: "14px" }}
                >{editor?.trim()}
                </span>
                <span className={classes.btnStyle}
                  style={{ marginTop: "-3px", paddingLeft: "5px", cursor: "pointer" }}
                  onClick={() => toggleBtn()}>
                  {btnText}
                </span>
              </td>
            </tr>
          </table>

        </Box>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(BaseWithhtml);
