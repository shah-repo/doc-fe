import "moment-timezone";
import moment from "moment-timezone";

const momentInPST = () => moment().tz("America/Los_Angeles");
export const lotDateSuffix = momentInPST().format("YYMMDD");
export const emailDateOffset = (5 * 1000);
export const fileTimeFormat = momentInPST().format("_YYYY-MMM-DD_HH-MM-SS");
export const pdfFooterDate = momentInPST().format("D MMM YYYY");
export const pdfDocRelDate = momentInPST().format("D MMM YYYY");
