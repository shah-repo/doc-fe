import { Box, Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { truncate } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { convertHtmlEntities } from "../../../common/utils/helpers";
import Text from "../../components/Text";
import styles from "./styles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
  labelStyle,
  valueStyle,
}) => {
  const intl = useIntl();
  const viewMore = intl.formatMessage({ id: "document.revision.view.more" });
  const viewLess = intl.formatMessage({ id: "document.revision.view.less" });
  const [editor, setEditor] = useState<string>("");
  const [btnText, setBtnText] = useState(viewMore);
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
      length: 100,
      separator: " ",
    });
    setEditor(truncatedText);
  };

  const toggleBtn = () => {
    setFlag(!flag);
    if (flag) {
      getTruncatText();
      setBtnText(viewMore);
    } else {
      completeText();
      setBtnText(viewLess);
    }
  };

  return (
    <Grid item={true} xs={12} style={{ marginBottom: "-24px" }} >
      {label && (
        <Grid item={true} xs={12} id="BaseWithhtml-label">
          <Typography style={labelStyle}>
            <Text message={label} />
          </Typography>
        </Grid>
      )}
      <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
        <Box className={classes.descriptionContainer} >
          <span
            style = { { fontSize: "14px" }}
          >{editor?.trim()}
            <span className={classes.btnStyle}
              style={{
                marginTop: "-3px",
                paddingLeft: "5px",
                cursor: "pointer",
                display: editedValue?.length < 100 ? "none" : "",
              }}
              onClick={() => toggleBtn()}>
              {btnText}
            </span>
          </span>
        </Box>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(BaseWithhtml);
