import { getStartOfDayDateString, toStartOfDay } from "./date";

describe("common/utils/date", () => {
  it("getStartOfDayDateString - convert date to start of day America/Los_Angeles", () => {
    const date = toStartOfDay("2019-09-27T07:00:00.000Z");
    const dateString = getStartOfDayDateString(date);

    expect(dateString).toBe("2019-09-27T00:00:00-07:00");
  });

  it("toStartOfDay", () => {
    const date = "2019-09-27T07:00:00.000Z";
    const dateString = toStartOfDay(date);
    const expected = new Date(2019, 8, 27);

    expect(dateString).toMatchObject(expected);
  });

  it("getStartOfDayDateString - date string in LL format", () => {
    const date = toStartOfDay("2019-09-27T07:00:00.000Z");
    const dateString = getStartOfDayDateString(date, "LL");

    expect(dateString).toBe("September 27, 2019");
  });
});
