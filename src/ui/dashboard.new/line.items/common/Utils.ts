
export const formatCurrency = (data: string) =>  {
  if (data && !isNaN(+data)) {
    return (+data).toLocaleString();
  }
  return "";
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
