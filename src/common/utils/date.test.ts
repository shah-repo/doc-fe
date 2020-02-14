import moment from "moment-timezone";
import {
  toStartOfDay,
  getStartOfDayDateString,
} from "./date";

describe("common/utils/date", () => {
  it("getDateString - convert date to start of day America/Los_Angeles", () => {
    const date = "2019-09-27T07:00:00.000Z";
    const dateString = getStartOfDayDateString(date);

    expect(dateString).toBe("2019-09-27T00:00:00-07:00");
  });

  it("applyTimezoneToDate", () => {
    const date = "2019-09-27T00:00:00.000Z";
    const dateString = toStartOfDay(date);
    const expected = moment("2019-09-27T07:00:00.000Z").toDate();

    expect(dateString).toMatchObject(expected);
  });

  it("getFormattedDateString - date string in LL format", () => {
    const date = "2019-09-27T07:00:00.000Z";
    const dateString = getStartOfDayDateString(date, "LL");

    expect(dateString).toBe("September 27, 2019");
  });
});
