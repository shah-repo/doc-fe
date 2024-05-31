import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { ReactComponent as CloseIcon } from '../../../../assets/images/cross.svg';
import useStyles from './styles';

interface ModalReportProps {
  bulkImportReports: string | null
  open: boolean
  onClose: () => void
}

interface Section {
  title: string
  rows: string[]
  isGlobalTitle: boolean
}

const ModalReport: React.FC<ModalReportProps> = ({ bulkImportReports, open, onClose }) => {
  function parseBulkImportReports (reportString: string): Section[] {
    const sections: Section[] = [];
    const regex = /======== ([^=]+) ========/g;

    // Split text by lines to prepare for processing
    const lines = reportString.split('\n');

    // Temporary variables to store data for each section
    let currentTitle = '';
    let isGlobalTitle = false;
    let currentRows: string[] = [];

    lines.forEach(line => {
      const newTitleMatch = line.match(regex);
      if (newTitleMatch) {
        // If there's already collected data, push the current section to sections
        if (currentTitle !== '') {
          sections.push({ title: currentTitle, rows: currentRows, isGlobalTitle });
        }
        // Extract title and reset rows for the new section
        isGlobalTitle = /\[.*\]/.test(newTitleMatch[0]);
        currentTitle = newTitleMatch[0].replace(/^======== \[?|]? ========$/g, '').trim();
        currentRows = [];
      } else {
        // Collect rows that are not title lines
        if (line.trim() !== '') {
          currentRows.push(line);
        }
      }
    });

    // Push the last collected section, if any
    if (currentTitle !== '') {
      sections.push({ title: currentTitle, rows: currentRows, isGlobalTitle });
    }

    return sections;
  }

  const splitTheValues = (text: string): string[] => {
    return text.split(',').map((value) => value.trim());
  };

  const classes = useStyles();
  if (!bulkImportReports) return null;

  const sections = parseBulkImportReports(bulkImportReports);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box className={classes.dialogTitleContainer}>
          <IconButton
            className={classes.close}
            size="small"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.dialogContentContainer}>
        {sections.map((section, index) => {
          let titles: string[] = [];
          if (section.rows.length > 1) {
            titles = splitTheValues(section.rows[0]);
          }

          return (
            <Box key={index}>
              <Typography variant={section.isGlobalTitle ? 'h4' : 'h6' } gutterBottom>{section.title}</Typography>
              {section.rows.length > 1 ? (
                <Paper>
                  <Table aria-label="simple table" className={classes.tableCenterValues}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        {titles.map((title, idx) => (
                          <TableCell key={`${title}-${idx}}`}>{title}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.rows.slice(1).map((row, index) => {
                        const rows = splitTheValues(row);
                        return (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">{index + 1}</TableCell>
                            {rows.map((row, idx) => (
                              <TableCell key={`${row}-${idx}}`}>{row}</TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              ) : null}
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default ModalReport;
