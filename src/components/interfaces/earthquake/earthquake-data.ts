export interface EarthquakeData extends Item {}

export interface Item {
  id: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  locationName: string;
  latitude: number;
  longitude: number;
  eqDepth: number;
  eqMagnitude: number;
  intensity: number;
  deaths: number;
  deathsAmountOrder: number;
  injuries: number;
  injuriesAmountOrder: number;
  damageAmountOrder: number;
  housesDestroyed: number;
  housesDestroyedAmountOrder: number;
  housesDamaged: number;
  housesDamagedAmountOrder: number;
  tsunamiEventId: number;
  eqMagMw: number;
  publish: boolean;
  deathsTotal: number;
  deathsAmountOrderTotal: number;
  injuriesTotal: number;
  injuriesAmountOrderTotal: number;
  damageAmountOrderTotal: number;
  housesDestroyedTotal: number;
  housesDestroyedAmountOrderTotal: number;
  housesDamagedTotal: number;
  housesDamagedAmountOrderTotal: number;
  country: string;
  regionCode: number;
}
