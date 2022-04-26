import "moment-timezone";
import moment from "moment-timezone";

export const lotDateSuffix = () => moment().tz("America/Los_Angeles").format("YYMMDD");
export const pdfFooterDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
export const pdfDocRelDate = moment().tz("America/Los_Angeles").format("D MMM YYYY");
export const emailDateOffset = (5 * 1000);
