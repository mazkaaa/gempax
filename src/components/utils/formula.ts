const getTotalHousesDestroyed = (data: any[]): number => {
  return data.reduce((a, b) => (a || 0) + (b.housesDestroyed || 0), 0);
};
const getTotalHousesDamaged = (data: any[]): number => {
  return data.reduce((a, b) => (a || 0) + (b.housesDamaged || 0), 0);
};
const getTotalDeaths = (data: any[]): number => {
  return data.reduce((a, b) => (a || 0) + (b.deaths || 0), 0);
};
const getTotalInjuries = (data: any[]): number => {
  return data.reduce((a, b) => (a || 0) + (b.injuries || 0), 0);
};
const getMostDestructiveYear = (data: any[]): number | null => {
  const yearTotals: { [key: number]: number } = data.reduce(
    (
      acc: {
        [key: number]: number;
      },
      curr,
    ) => {
      const year = curr.year;
      if (curr.housesDestroyedTotal !== undefined) {
        acc[year] = (acc[year] || 0) + curr.housesDestroyedTotal;
      }
      return acc;
    },
    {},
  );

  // Find the year with the highest destroyed house value
  const highestValue = Math.max(...Object.values(yearTotals));
  const highestYear = Object.entries(yearTotals).find(
    ([year, value]) => value === highestValue,
  )?.[0];

  return highestYear ? parseInt(highestYear) : null;
};
const getLessDestructiveYear = (data: any[]): number | null => {
  const yearTotals: { [key: number]: number } = data.reduce(
    (
      acc: {
        [key: number]: number;
      },
      curr,
    ) => {
      const year = curr.year;
      if (curr.housesDestroyedTotal !== undefined) {
        acc[year] = (acc[year] || 0) + curr.housesDestroyedTotal;
      }
      return acc;
    },
    {},
  );

  // Find the year with the highest destroyed house value
  const highestValue = Math.min(...Object.values(yearTotals));
  const highestYear = Object.entries(yearTotals).find(
    ([year, value]) => value === highestValue,
  )?.[0];

  return highestYear ? parseInt(highestYear) : null;
};
const getMostFrequentYear = (data: any[]): number | null => {
  const years = data.map((d) => d.year);
  const counts: {
    [key: number]: number;
  } = {};

  years.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1;
  });

  const max = Math.max(...Object.values(counts));
  const year = Object.keys(counts).find((key) => counts[key as any] === max);
  return year ? parseInt(year) : null;
};
const getLessFrequentYear = (data: any[]): number | null => {
  const years = data.map((d) => d.year);
  const counts: {
    [key: number]: number;
  } = {};

  years.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1;
  });

  const min = Math.min(...Object.values(counts));
  const year = Object.keys(counts).find((key) => counts[key as any] === min);
  return year ? parseInt(year) : null;
};

export {
  getTotalHousesDestroyed,
  getTotalDeaths,
  getTotalHousesDamaged,
  getTotalInjuries,
  getMostDestructiveYear,
  getLessDestructiveYear,
  getMostFrequentYear,
  getLessFrequentYear,
};
