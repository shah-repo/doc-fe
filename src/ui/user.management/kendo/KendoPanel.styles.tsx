import { makeStyles } from '@material-ui/core';

const PANELS_HEIGHT = 256;

const KendoPanelStyles = makeStyles((theme) => ({
  userGroupGrid: {
    height: `calc(100vh - ${PANELS_HEIGHT}px)`,
  },
}));

export default KendoPanelStyles;
