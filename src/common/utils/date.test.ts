import moment from "moment-timezone";
import {
  getStartOfDayDateString,
  toStartOfDay,
} from "./date";

describe("common/utils/date", () => {
  it("getStartOfDayDateString - convert date to start of day America/Los_Angeles", () => {
    const date = "2019-09-27T00:00:00.000Z";
    const dateString = getStartOfDayDateString(date);

    expect(dateString).toBe("2019-09-26T00:00:00-07:00");
  });

  it("toStartOfDay", () => {
    const date = "2019-09-27T00:00:00.000Z";
    const dateString = toStartOfDay(date);
    const expected = moment("2019-09-26T07:00:00.000Z").toDate();

    expect(dateString).toMatchObject(expected);
  });

  it("getStartOfDayDateString - date string in LL format", () => {
    const date = "2019-09-27T00:00:00.000Z";
    const dateString = getStartOfDayDateString(date, "LL");

    expect(dateString).toBe("September 26, 2019");
  });
});
