import { unmaskId } from "./helpers";

describe("/state/ducks//helpers", () => {
  it("unmaskId - returns ID without strings", () => {
    const unmasked = unmaskId("SOP015");

    expect(unmasked).toBe("15");
  });

  it("unmaskId - returns empty string", () => {
    const unmasked = unmaskId("SOP000");

    expect(unmasked).toBe("");
  });
});
