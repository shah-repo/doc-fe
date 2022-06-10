import "moment-timezone";
import moment from "moment-timezone";

export const momentInPST = () => moment().tz("America/Los_Angeles");
export const lotDateSuffix = () => momentInPST().format("YYMMDD");
export const emailDateOffset = (5 * 1000);
export const fileTimeFormat = momentInPST().format("_YYYY-MMM-DD_HH-MM-SS");
export const pdfFooterDate = momentInPST().format("D MMM YYYY");
export const pdfDocRelDate = momentInPST().format("D MMM YYYY");
export const pdfDocRelDateMonthFirst = momentInPST().format("MMM D, YYYY");
export const equimentDueDays = 365;
export const equimentDueDaysFmt = momentInPST().add(equimentDueDays, "days").format("ddd MMM D YYYY");
export const lotDocumentIdRef = `LOT #` + lotDateSuffix();