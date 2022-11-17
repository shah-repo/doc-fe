import { Box, Button, Chip, CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, FormControlLabel, Grid, List, ListItem, ListItemText, MenuItem, MenuList, Switch } from "@material-ui/core";
import cx from "classnames";
import { remove } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { FB } from "..";
import { SMText } from "../../../App";
import { ReactComponent as ExpandIcon } from "../../../assets/images/tabExpand.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { getLatesReferenceVersion } from "../../documentRevision/forms/transform";
import { Equipment, ItemProps, LotItem, Material, MaterialEqProps, PanelData, PanelProps } from "./FBMaterailEqInfo.types";
import useStyles, { useItemStatusStyles } from "./FBMaterialEqInfo.styles";

const DATE_FORMAT = MomentFormats.BriefDate;

const MaterialItem: React.FC<ItemProps<Material>> = ({ item, classes }) => {

  const { workspaceState } = FB.useStores();
  const smartReferencesFrom = workspaceState?.document?.smartReferencesFrom?.filter( (ref) => ref.active
        && ref.type === SmartReferenceType.HiddenPiInstance);
  const highestReference = getLatesReferenceVersion(smartReferencesFrom);
  const multiplier = highestReference?.fromDocRev?.formInput?.["lhrs-start-quantity"] || 1;

  return (<>
    <ListItemText>
      {item.docId && `${item.docId} -`} {item.title} | {item.unit} : {item.quantity * multiplier}

    </ListItemText>
    <ListItemText>
      {item.lots && item.lots.map((lot: LotItem) => (
        <Chip
          className={classes.chip}
          key={lot.lotId}
          size="small"
          label={`Lot ${lot.lotId ?? ""} | ${lot.partId ?? "N/A"} | ${lot.quantity ?? ""} ${lot.unit ?? ""}`}
        />
      ))}
    </ListItemText>
  </>);
};

const EquipmentItem: React.FC<ItemProps<Equipment>> = ({ item, classes }) => {
  const intl = useIntl();

  return (
    <>
      <ListItemText>
        {item.docId && `${item.docId} -`} {item.title}
      </ListItemText>
      <ListItemText>
        {item.nextCalibration && (
          <Chip
            className={classes.chip}
            size="small"
            label={
              intl.formatMessage({ id: "meq.chip.nextCalDate" })
              + getFormattedDateString(item.nextCalibration, DATE_FORMAT)
            }
          />
        )}
        {item.nextPm && (
          <Chip
            className={classes.chip}
            size="small"
            label={
              intl.formatMessage({ id: "meq.chip.prevMaintance" })
              + getFormattedDateString(item.nextPm, DATE_FORMAT)
            }
          />
        )}
      </ListItemText>
    </>
  );
};

const Panel: React.FC<PanelProps> = ({ panel, data = [], expanded, loading, classes, togglePanel }) => {
  const itemClasses = useItemStatusStyles();
  const PanelItem = panel.itemComponent;
  const haveData = Boolean(data.length);

  return (
    <Box key={panel.dataKey} className={classes.panel}>
      <ExpansionPanel expanded={expanded}>
        <ExpansionPanelSummary
          classes={{
            root: classes.panelSummary,
            content: classes.panelSummaryContent,
            expandIcon: classes.panelSummaryIcon,
          }}
          onClick={togglePanel}
          expandIcon={<ExpandIcon fontSize="small" />}
        >
          <SMText label={panel.title} boxProps={{ className: classes.panelSummaryTitle }} />
          {!loading && haveData && (
            <SMText
              label={{
                locale: "common.items.count",
                values: {
                  count: String(data.length),
                },
              }}
              boxProps={{ className: classes.panelSummaryCount }}
            />
          )}
          {loading && <CircularProgress size={14} />}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelDetails}>
          <List className={classes.panelDetailsList}>
            {haveData ?
              data.map((item, pos) => (
                <ListItem
                  key={`${item.docId}-${item.title}`}
                  divider={pos < data.length - 1}
                  className={cx(classes.panelDetailsListItem, {
                    [itemClasses[item.status ?? ""]]: item.status,
                  })}
                >
                  <PanelItem item={item} classes={classes} />
                </ListItem>
              )) :
              <ListItem className={classes.panelDetailsListItem}><SMText label="common.none" /></ListItem>
            }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Box>
  );
};

const panels: PanelData[] = [
  {
    dataKey: "materials",
    title: "form.builder.materials",
    itemComponent: MaterialItem,
  },
  {
    dataKey: "equipment",
    title: "form.builder.equipment",
    itemComponent: EquipmentItem,
  },
];

const FBMaterialEqInfoPresenter: React.FC<MaterialEqProps> = ({
  data,
  showDiff,
  includeDiff,
  handleShowDiffChange,
  loading,
}) => {
  const [expandedPanels, setExpanedPanels] = useState<string[]>([]);
  const allPanelsExpaned = expandedPanels.length === panels.length;
  const classes = useStyles();

  const toggleAllPanels = () => setExpanedPanels(() => (
    allPanelsExpaned ? [] : panels.map((panel) => panel.dataKey)
  ));
  const togglePanel = (key: string) => () => setExpanedPanels((state) => (
    state.includes(key) ? remove(state, key) : [...state, key]
  ));
  const jumpToPanel = (key: string) => () => setExpanedPanels([key]);

  return (
    <Box className={classes.root}>
      {includeDiff && (
        <Box className={classes.diffSwitch}>
          <FormControlLabel
            className={classes.switchLabel}
            control={
              <Switch
                classes={{
                  root: classes.switchRoot,
                  switchBase: classes.switchBase,
                  thumb: classes.switchThumb,
                  track: classes.switchTrack,
                  checked: classes.switchChecked,
                }}
                checked={showDiff}
                onChange={(e, checked) => handleShowDiffChange(checked)}
              />
            }
            label={<SMText label="form.builder.prev.build.changes" boxProps={{ className: classes.switchLabel }} />}
          />
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Box mb={1}>
            <Button variant="text" disableRipple className={classes.expandButton} onClick={toggleAllPanels}>
              <SMText label={allPanelsExpaned ? "common.collapse.all" : "common.expand.all"} />
            </Button>
          </Box>
          {panels.map((panel) => (
            <Panel
              key={panel.dataKey}
              panel={panel}
              data={data?.[panel.dataKey]}
              expanded={expandedPanels.includes(panel.dataKey)}
              togglePanel={togglePanel(panel.dataKey)}
              loading={loading}
              classes={classes}
            />
          ))}
        </Grid>
        <Grid item xs={3}>
          <SMText label={"common.jump.to"} boxProps={{ className: classes.navTitle }} />
          <MenuList>
            {panels.map((panel) => (
              <MenuItem
                key={panel.dataKey}
                onClick={jumpToPanel(panel.dataKey)}
                selected={expandedPanels.includes(panel.dataKey)}
                className={classes.navItem}
              >
                <SMText label={panel.title} />
              </MenuItem>
            ))}
          </MenuList>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FBMaterialEqInfoPresenter;
