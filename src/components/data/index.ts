import { EARTHQUAKE_DATA_KEYS, EarthquakeData } from "../interfaces";
import { formatDigitNumber, getTotalValue } from "../utils";

interface GENERAL_INFORMATION_INTERFACE {
  id: string;
  label: string;
  data_key: EARTHQUAKE_DATA_KEYS;
  formula: (
    data: EarthquakeData[],
    key: EARTHQUAKE_DATA_KEYS,
  ) => string | number | null;
}
export const GENERAL_INFORMATION_DATA: GENERAL_INFORMATION_INTERFACE[] = [
  {
    id: "houses_destroyed",
    label: "houses destroyed",
    data_key: "housesDestroyed",
    formula: (data, key) => {
      return formatDigitNumber(getTotalValue(data, key));
    },
  },
  {
    id: "houses_damaged",
    label: "houses damaged",
    data_key: "housesDamaged",
    formula: (data, key) => {
      return formatDigitNumber(getTotalValue(data, key));
    },
  },
  {
    id: "deaths",
    label: "deaths",
    data_key: "deaths",
    formula: (data, key) => {
      return formatDigitNumber(getTotalValue(data, key));
    },
  },
  {
    id: "injuries",
    label: "injuries",
    data_key: "injuries",
    formula: (data, key) => {
      return formatDigitNumber(getTotalValue(data, key));
    },
  },
  {
    id: "most_destructive_year",
    label: "most destructive year",
    data_key: "year",
    formula: (data) => {
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
        ([, value]) => value === highestValue,
      )?.[0];

      return highestYear ? parseInt(highestYear) : null;
    },
  },
  {
    id: "less_destructive_year",
    label: "less destructive year",
    data_key: "year",
    formula: (data) => {
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

      // Find the year with the lowest destroyed house value
      const lowestValue = Math.min(...Object.values(yearTotals));
      const highestYear = Object.entries(yearTotals).find(
        ([, value]) => value === lowestValue,
      )?.[0];

      return highestYear ? parseInt(highestYear) : null;
    },
  },
  {
    id: "most_frequent_year",
    label: "most frequent year",
    data_key: "year",
    formula: (data) => {
      const years = data.map((item) => item.year);
      const counts: {
        [key: number]: number;
      } = {};

      years.forEach((year) => {
        counts[year] = (counts[year] || 0) + 1;
      });

      const max = Math.max(...Object.values(counts));
      const year = Object.keys(counts).find(
        (key) => counts[parseInt(key)] === max,
      );

      return year ? parseInt(year) : null;
    },
  },
  {
    id: "less_frequent_year",
    label: "less frequent year",
    data_key: "year",
    formula: (data) => {
      const years = data.map((item) => item.year);
      const counts: {
        [key: number]: number;
      } = {};

      years.forEach((year) => {
        counts[year] = (counts[year] || 0) + 1;
      });

      const min = Math.min(...Object.values(counts));
      const year = Object.keys(counts).find(
        (key) => counts[parseInt(key)] === min,
      );

      return year ? parseInt(year) : null;
    },
  },
];
