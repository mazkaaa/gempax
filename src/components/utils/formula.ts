import { EARTHQUAKE_DATA_KEYS, EarthquakeData } from "../interfaces";
//   const years = data.map((d) => d.year);
//   const counts: {
//     [key: number]: number;
//   } = {};

//   years.forEach((x) => {
//     counts[x] = (counts[x] || 0) + 1;
//   });

//   const max = Math.max(...Object.values(counts));
//   const year = Object.keys(counts).find((key) => counts[key as any] === max);
//   return year ? parseInt(year) : null;
// };
// const getLessFrequentYear = (data: EarthquakeData[]): number | null => {
//   const years = data.map((d) => d.year);
//   const counts: {
//     [key: number]: number;
//   } = {};

//   years.forEach((x) => {
//     counts[x] = (counts[x] || 0) + 1;
//   });

//   const min = Math.min(...Object.values(counts));
//   const year = Object.keys(counts).find((key) => counts[key as any] === min);
//   return year ? parseInt(year) : null;
// };

// Basic formula

const getTotalValue = (data: EarthquakeData[], key: EARTHQUAKE_DATA_KEYS) => {
  return data.reduce((a, b) => (a || 0) + (Number(b[key]) || 0), 0);
};

export { getTotalValue };
