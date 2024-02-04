export interface EarthquakeHistoryInterface {
  i_d: string;
  flag_tsunami: string | null;
  year: number;
  month: null | string;
  day: null | string;
  focal_depth: number | null;
  eq_primary: number | null;
  eq_mag_mw: number | null;
  eq_mag_ms: number | null;
  eq_mag_mb: number | null;
  eq_mag_ml: number | null;
  eq_mag_mfa: null;
  eq_mag_unk: number | null;
  intensity: number | null;
  country: string;
  state: null;
  location_name: string;
  region_code: number;
  deaths: number | null;
  deaths_description: string | null;
  missing: number | null;
  missing_description: string | null;
  injuries: number | null;
  injuries_description: string | null;
  damage_millions_dollars: number | null;
  damage_description: string | null;
  houses_destroyed: number | null;
  houses_destroyed_description: string | null;
  houses_damaged: null | string;
  houses_damaged_description: string | null;
  total_deaths: number | null;
  total_deaths_description: string | null;
  total_missing: number | null;
  total_missing_description: string | null;
  total_injuries: number | null;
  total_injuries_description: string | null;
  total_damage_millions_dollars: null | string;
  total_damage_description: string | null;
  total_houses_destroyed: number | null;
  total_houses_destroyed_description: string | null;
  total_houses_damaged: number | null;
  total_houses_damaged_description: string | null;
  coordinates: Coordinates | null;
}

export interface Coordinates {
  lon: number;
  lat: number;
}

export enum DamageDescription {
  EXTREME25MillionOrMore = "EXTREME (~$25 million or more)",
  LIMITEDRoughlyCorrespondingToLessThan1Million = "LIMITED (roughly corresponding to less than $1 million)",
  MODERATE1To5Million = "MODERATE (~$1 to $5 million)",
  SEVERE5To24Million = "SEVERE (~>$5 to $24 million)",
}

export enum Description {
  Few1To50Deaths = "Few (~1 to 50 deaths)",
  Many101To1000Deaths = "Many (~101 to 1000 deaths)",
  Some51To100Deaths = "Some (~51 to 100 deaths)",
  VeryMany1001OrMoreDeaths = "Very Many (~1001 or more deaths)",
}

export enum EdDescription {
  Few1To50Houses = "Few (~1 to 50 houses)",
  Many101To1000Houses = "Many (~101 to 1000 houses)",
  Some51To100Houses = "Some (~51 to 100 houses)",
  VeryMany1001OrMoreHouses = "Very Many (~1001 or more houses)",
}
