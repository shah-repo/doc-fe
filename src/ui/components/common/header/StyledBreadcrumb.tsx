import { Breadcrumbs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Colors from "../../../layout/theme/utils/colors";

const styles = () => ({
  separator: {
    color: Colors.white,
  },
});

export const StyledBreadcrumb = withStyles(styles)(Breadcrumbs);
