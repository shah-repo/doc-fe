import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { truncate } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { convertHtmlEntities } from "../../../common/utils/helpers";
import Colors from "../../layout/theme/utils/colors";
import styles from "./newStyles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
  labelProps,
  labelFont,
}) => {
  const intl = useIntl();
  const viewMore = intl.formatMessage({ id: "document.revision.view.more" });
  const viewLess = intl.formatMessage({ id: "document.revision.view.less" });
  const [editor, setEditor] = useState<string>("");
  const [btnText, setBtnText] = useState(viewMore);
  const [flag, setFlag] = useState(false);
  const editedValue = value ? convertHtmlEntities(value.replace(/(<([^>]+)>|\/n|\n)/g, " ")) : "";
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
    <Grid item={true} xs={12}>
      <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
        <Box
          bgcolor={ "transparent"}
          borderRadius={4}
          display="flex"
          style={{
            gridArea: "1/1",
          }}
          overflow= "auto"
          className={classes.descriptionContainer}
        >
          <span
            style = { {
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "25px",
              color: Colors.almost_black,
            }}
            id="SummaryHeaderDecription-Text"
            data-cy="SummaryHeaderDecription-Text"
          >{editor?.trim()}
            <span className={classes.btnStyle}
              id="SummaryHeaderDecription-ViewMore-button"
              data-cy="SummaryHeaderDecription-ViewMore-button"
              style={{
                marginTop: "-3px",
                cursor: "pointer",
                display: editedValue?.length < 100 ? "none" : "",
                color: Colors.navy,
                padding: "0 2px",
                fontSize: "14px",
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
