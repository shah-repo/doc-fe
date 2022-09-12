import { Box, Button, Chip, CircularProgress, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, FormControlLabel, Grid, List, ListItem, ListItemText, Switch } from "@material-ui/core";
import { remove } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { SMText } from "../../../App";
import { ReactComponent as ExpandIcon } from "../../../assets/images/tabExpand.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { Equipment, LotItem, Material, MaterialEqProps } from "./FBMaterailEqInfo.types";

const DATE_FORMAT = MomentFormats.BriefDate;

const MaterialItem = ({ item }: { item: Material}) => (
  <>
    <ListItemText>
      {item.docId} - {item.title} | {item.unit} : {item.quantity}
    </ListItemText>
    <ListItemText>
      {item.lots && item.lots.map((lot: LotItem) => (
        <Chip
          key={lot.lotId}
          size="small"
          label={`Lot ${lot.lotId || ""} | ${lot.partId || "N/A"} | ${lot.quantity || ""} ${lot.unit || ""}`}
        />
      ))}
    </ListItemText>
  </>
);

const EquipmentItem = ({ item }: { item: Equipment }) => {
  const intl = useIntl();

  return (
    <>
      <ListItemText>
        {item.docId} - {item.title}
      </ListItemText>
      <ListItemText>
        {item.nextCalibration && (
          <Chip
            size="small"
            label={
              intl.formatMessage({ id: "meq.chip.nextCalDate" })
              + getFormattedDateString(item.nextCalibration, DATE_FORMAT)
            }
          />
        )}
        {item.nextPm && (
          <Chip
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

const Panel = ({ panel, data, expanded, togglePanel }) => {
  const PanelItem = panel.item;

  return (
    <Box mb={1} key={panel.dataKey}>
      <ExpansionPanel {...{ expanded }}>
        <ExpansionPanelSummary
          onClick={togglePanel}
          expandIcon={<ExpandIcon fontSize="small" />}
        >
          <SMText label={panel.title} />
          {data.length && (
            <SMText label={{
              locale: "common.items.count",
              values: {
                count: data.length,
              },
            }} />
          )}
          <CircularProgress size={12} />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            {data.map((item: Material | Equipment, pos: number) => (
              <>
                <ListItem>
                  <PanelItem key={item.docId} {...{ item }} />
                </ListItem>
                {(pos < data.length - 1) && <Divider />}
              </>
            ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Box>
  );
};

const panels = [
  {
    dataKey: "materials",
    title: "form.builder.materials",
    item: MaterialItem,
  },
  {
    dataKey: "equipment",
    title: "form.builder.equipment",
    item: EquipmentItem,
  },
];

const FBMaterialEqInfoPresenterNext: React.FC<MaterialEqProps> = ({
  materialData,
  showDiff,
  handleShowDiffChange,
}) => {
  const [expandedPanels, setExpanedPanels] = useState<string[]>([]);
  const allPanelsExpaned = expandedPanels.length === panels.length;

  const toggleAllPanels = () => {
    setExpanedPanels(() => (
      allPanelsExpaned ? [] : panels.map((panel) => panel.dataKey)
    ));
  };
  const togglePanel = (key: string) => () => {
    setExpanedPanels((state) => (
      state.includes(key) ? remove(state, key) : [...state, key]
    ));
  };
  const jumpToPanel = (key: string) => () => {
    setExpanedPanels([key]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={9}>
        <FormControlLabel
          control={<Switch checked={showDiff} onChange={(e, checked) => handleShowDiffChange(checked)} />}
          label={<SMText label="form.builder.prev.build.changes" />}
        />
        <Box mb={1}>
          <Button variant="text" onClick={toggleAllPanels}>
            <SMText label={allPanelsExpaned ? "common.collapse.all" : "common.expand.all"} />
          </Button>
        </Box>
        {panels.map((panel) => (
          <Panel
            key={panel.dataKey}
            panel={panel}
            data={materialData[panel.dataKey]}
            expanded={expandedPanels.includes(panel.dataKey)}
            togglePanel={togglePanel(panel.dataKey)}
          />
        ))}
      </Grid>
      <Grid item xs={3}>
        <Box>
          <SMText label={"common.jump.to"} />
          {panels.map((panel) => (
            <Button key={panel.dataKey} variant="text" fullWidth onClick={jumpToPanel(panel.dataKey)}>
              <SMText label={panel.title} />
            </Button>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default FBMaterialEqInfoPresenterNext;
