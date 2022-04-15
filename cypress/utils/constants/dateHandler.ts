import "moment-timezone";
import moment from "moment-timezone";

export const lotDateSuffix = () => moment().tz("America/Los_Angeles").format("YYMMDD");
