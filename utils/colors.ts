const colors = [
  [0, 116, 217],
  [255, 133, 27],
  [46, 204, 64],
  [255, 65, 54],
  [255, 220, 0],
  [127, 219, 255],
  [177, 13, 201],
  [57, 204, 204],
  [0, 31, 63],
  [1, 255, 112],
];

const packageColorRecord: Record<string, number[]> = {};

export function getColors(packageNames: string[]): typeof packageColorRecord {
  Object.keys(packageColorRecord).forEach((packageName) => {
    if (!packageNames.includes(packageName)) {
      delete packageColorRecord[packageName];
    }
  });

  const unusedColorsSet = new Set(colors.map((color) => color.join(',')));
  Object.values(packageColorRecord).forEach((color) => unusedColorsSet.delete(color.join(',')));
  const unusedColors = Array.from(unusedColorsSet.values()).map((color) => color.split(',').map(Number));
  let index = 0;
  packageNames.forEach((packageName) => {
    if (!packageColorRecord[packageName]) {
      packageColorRecord[packageName] = unusedColors[index];
      index++;
    }
  });

  return packageColorRecord;
}
