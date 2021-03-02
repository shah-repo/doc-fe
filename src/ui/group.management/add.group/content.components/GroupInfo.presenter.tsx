import { Box, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { Translation } from "../../../translations/types";
import { styles } from "./GroupInfo.styles";

interface Props {
  items: any[];
  title: Translation;
}

const GroupInfoPresenter: React.FunctionComponent<Props> = ({
  items,
  title,
}) => {
  const classes = styles();
  return (
    <Box>
      <Typography variant="h5" style={{ marginBottom: 5 }}><Text translation={title}/></Typography>
      <Box>
        {!isEmpty(items) && items.map((item) =>
          <Box key={item} display="inline-flex">
            <div className={classes.item}>{item}</div>
          </Box>
        )}
        {isEmpty(items) &&
        <Typography variant="subtitle1" style={{ marginBottom: 5 }}>
          <Text translation="fields.select.none"/>
        </Typography>
        }
      </Box>
    </Box>);
};

export default GroupInfoPresenter;
