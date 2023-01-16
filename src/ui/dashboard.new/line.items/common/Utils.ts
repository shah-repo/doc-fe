import { size, toNumber } from "lodash";
import { Translation } from "../../../translations/types";

export const formatCurrency = (data: string) =>  {
  const language = "en";
  if (data && !isNaN(+data)) {
    return (+data).toLocaleString(language, {
      minimumFractionDigits: 2,
    });
  }
  return "";
};

export const formatNumberToCurrency = (data: number) =>  {
  if (!isNaN(data)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(data);
  }
  return data;
};

export const toFixed = (value: string | number) => {
  if (Number.isNaN(toNumber(value))) {
    return value;
  }
  if (!Number.isInteger(toNumber(value)) && value?.toString()?.split(".")[1]?.length > 10) {
    const arr = value?.toString()?.split(".");
    return toNumber(`${arr[0]}.${arr[1].slice(0, 10)}`);
  }
  else { return toNumber(value); }
};
export const linearScale = (domain: number[], range: number[]) => {
  const scale = (value: number) => {
    const [minValue, maxValue] = [...domain];
    const [minScale, maxScale] = [...range];

    const ratio = (maxScale - minScale) / (maxValue - minValue);
    const result = minScale + ratio * (value - minValue);

    if (result === Infinity) { return maxScale; }
    else if (result === -Infinity) { return minScale; }
    else if (isNaN(result)) { return minScale; }
    return result;
  };
  return scale;
};

export const scrollToBottom = (selector) => {
  const el = document.querySelector<HTMLElement>(selector);
  el?.scrollIntoView({ behavior: "smooth" });
};

export const getPendingTooltipText = (pendingCount, approvedCount) => {
  const pending = size(pendingCount);
  const approved = size(approvedCount);
  const count = pending + approved;
  const primaryText = count > 1 ? "assigned.users.counts" : "assigned.users.count";
  let secondaryText = "approved.and.pending.count.many.to.many";
  if (approved <= 1 && pending > 1) {
    secondaryText = "approved.and.pending.count.one.to.many";
  } else if (approved <= 1 && pending <= 1) {
    secondaryText = "approved.and.pending.count.one.to.one";
  } else if (approved > 1 && pending <= 1) {
    secondaryText = "approved.and.pending.count.many.to.one";
  }
  return {
    count,
    pending,
    approved,
    primaryText: primaryText as Translation,
    secondaryText: secondaryText as Translation,
  };
};
