"use client";
import Image from "next/image";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl";
import { ScreenGridLayer } from "@deck.gl/aggregation-layers/typed";
import { useEffect, useState } from "react";
import earthQuakeHistory from "../earthquake-history.json";
import { EarthquakeHistoryInterface } from "@/components/interfaces/earthquake-history";

interface BMKGDataType {
  Bujur: string;
  Coordinates: string;
  DateTime: string;
  Dirasakan: string;
  Jam: string;
  Kedalaman: string;
  Lintang: string;
  Magnitude: string;
  Tanggal: string;
  Wilayah: string;
}

interface EarthquakeData {
  coords: {
    lat: number;
    long: number;
  };
  date: string;
  magnitude: number | null;
  depth: number | null;
  location: string;
  deaths: number | null;
  deaths_description: string | null;
  missing: number | null;
  missing_description: string | null;
  injuries: number | null;
  injuries_description: string | null;
  damage_millions_dollars: string | null;
  damage_description: string | null;
  houses_destroyed: number | null;
  houses_destroyed_description: string | null;
  houses_damaged: null | number;
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
}

export default function Home() {
  const [data, setData] = useState<EarthquakeData[]>([]);

  const [option, setOption] = useState<"realtime" | "history">("realtime");

  const [cellSize, setCellSize] = useState<number>(25);

  const colorRange = [
    [255, 255, 178, 25],
    [254, 217, 118, 85],
    [254, 178, 76, 127],
    [253, 141, 60, 170],
    [240, 59, 32, 212],
    [189, 0, 38, 255],
  ];

  const layers = [
    new ScreenGridLayer<EarthquakeData>({
      id: "grid",
      data: data,
      opacity: 0.8,
      getPosition: (d) => [d.coords.long, d.coords.lat],
      getWeight: (d) => d.magnitude || 0,
      cellSizePixels: cellSize,
      colorRange: colorRange as any,
      aggregation: "SUM",
    }),
  ];

  const fetchBMKGData = async () => {
    const res = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
    );
    const result = await res.json();
    const dataResult: BMKGDataType[] = result.Infogempa.gempa;
    setData(
      dataResult.map((gempa) => {
        return {
          coords: {
            long: parseFloat(gempa.Coordinates.split(",")[1]),
            lat: parseFloat(gempa.Coordinates.split(",")[0]),
          },
          date: gempa.DateTime,
          magnitude: parseFloat(gempa.Magnitude),
          depth: parseInt(gempa.Kedalaman.split(" ")[0]),
          location: gempa.Dirasakan,
          deaths: null,
          damage_description: null,
          damage_millions_dollars: null,
          deaths_description: null,
          houses_damaged: null,
          houses_damaged_description: null,
          houses_destroyed: null,
          houses_destroyed_description: null,
          injuries: null,
          injuries_description: null,
          missing: null,
          missing_description: null,
          total_damage_description: null,
          total_damage_millions_dollars: null,
          total_deaths: null,
          total_deaths_description: null,
          total_houses_damaged: null,
          total_houses_damaged_description: null,
          total_houses_destroyed: null,
          total_houses_destroyed_description: null,
          total_injuries: null,
          total_injuries_description: null,
          total_missing: null,
          total_missing_description: null,
        };
      }),
    );
  };

  const fetchOpenDataSoft = async () => {
    const dataResult: EarthquakeHistoryInterface[] = earthQuakeHistory;
    setData(
      dataResult.map((gempa) => {
        return {
          coords: {
            long: gempa.coordinates ? gempa.coordinates.lon : 0,
            lat: gempa.coordinates ? gempa.coordinates.lat : 0,
          },
          date: new Date(`${gempa.year}`).toISOString(),
          magnitude: gempa.eq_mag_mw,
          depth: gempa.focal_depth ? gempa.focal_depth : 0,
          location: gempa.location_name,
          deaths: gempa.total_deaths,
          damage_description: gempa.total_damage_description,
          damage_millions_dollars: gempa.total_damage_millions_dollars,
          deaths_description: gempa.total_deaths_description,
          houses_damaged: gempa.total_houses_damaged,
          houses_damaged_description: gempa.total_houses_damaged_description,
          houses_destroyed: gempa.total_houses_destroyed,
          houses_destroyed_description:
            gempa.total_houses_destroyed_description,
          injuries: gempa.total_injuries,
          injuries_description: gempa.total_injuries_description,
          missing: gempa.total_missing,
          missing_description: gempa.total_missing_description,
          total_damage_description: gempa.total_damage_description,
          total_damage_millions_dollars: gempa.total_damage_millions_dollars,
          total_deaths: gempa.total_deaths,
          total_deaths_description: gempa.total_deaths_description,
          total_houses_damaged: gempa.total_houses_damaged,
          total_houses_damaged_description:
            gempa.total_houses_damaged_description,
          total_houses_destroyed: gempa.total_houses_destroyed,
          total_houses_destroyed_description:
            gempa.total_houses_destroyed_description,
          total_injuries: gempa.total_injuries,
          total_injuries_description: gempa.total_injuries_description,
          total_missing: gempa.total_missing,
          total_missing_description: gempa.total_missing_description,
        };
      }),
    );
  };

  useEffect(() => {
    if (option === "realtime") {
      fetchBMKGData();
    } else {
      fetchOpenDataSoft();
    }
  }, [option]);

  const getAvgDepth = () => {
    const array = data.map((d) => d.depth);
    const sum = array.reduce((a, b) => (a || 0) + (b || 0));
    return sum || 0 / array.length;
  };
  const getAvgMagnitude = () => {
    const array = data.map((d) => d.magnitude);
    const sum = array.reduce((a, b) => (a || 0) + (b || 0));
    return sum || 0 / array.length;
  };
  const getMaxMagnitudeLocationName = () => {
    const max = Math.max(...data.map((d) => d.magnitude || 0));
    const maxData = data.find((d) => d.magnitude === max);
    return maxData?.location.split(" ")[1] || "N/A";
  };
  const getMaxMagnitude = () => {
    return Math.max(...data.map((d) => d.magnitude || 0));
  };
  const getMaxDepth = () => {
    return Math.max(...data.map((d) => d.depth || 0));
  };

  const getTotalHousesDestroyed = () => {
    return data.reduce((a, b) => (a || 0) + (b.houses_destroyed || 0), 0);
  };
  const getTotalHousesDamaged = () => {
    return data.reduce((a, b) => (a || 0) + (b.houses_damaged || 0), 0);
  };
  const getTotalDeaths = () => {
    return data.reduce((a, b) => (a || 0) + (b.deaths || 0), 0);
  };
  const getTotalInjuries = () => {
    return data.reduce((a, b) => (a || 0) + (b.injuries || 0), 0);
  };

  const formatNumber = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
  };

  return (
    <main className="relative h-full w-full">
      <div className="absolute left-4 top-4 z-50">
        <select
          onChange={(e) => {
            setOption(e.target.value as "realtime" | "history");
          }}
          value={option}
          className="select select-bordered select-sm w-full"
        >
          <option value={"realtime"}>Realtime</option>
          <option value={"history"}>History</option>
        </select>
      </div>
      <div className="absolute right-4 top-4 z-50 text-gray-700">
        <div className="h-auto w-96 bg-white">
          <section id="about" className="space-y-2 p-4 ">
            <h1 className="text-lg font-semibold">
              {option === "realtime"
                ? "Realtime Earthquake Data"
                : "Earthquake History"}
            </h1>
            <div className="space-y-1">
              <p className="text-sm">
                {option === "realtime"
                  ? "Latest 15 earthquakes data in realtime"
                  : "Information of destructive earthquakes from 2150 B.C. to the present."}
              </p>
              <p className="text-sm">
                Data source:{" "}
                {option === "realtime" ? (
                  <a
                    className="text-cyan-700"
                    href="https://data.bmkg.go.id/gempabumi/"
                  >
                    BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
                  </a>
                ) : (
                  <a
                    className="text-cyan-700"
                    href="https://public.opendatasoft.com/explore/dataset/significant-earthquake-database/"
                  >
                    National Centers for Environmental Information
                  </a>
                )}
              </p>
            </div>
          </section>

          <div className="w-full border-b"></div>

          <section id="filter" className="space-y-4 p-4 ">
            <div className="space-y-2">
              {/* <h1 className="text-lg font-semibold">Filter</h1> */}
              <div className="space-y-1">
                <p className="text-sm">Cell size</p>
                <input
                  type="range"
                  min={5}
                  max="25"
                  value={cellSize}
                  onChange={(e) => setCellSize(parseInt(e.target.value))}
                  className="range range-xs"
                />
              </div>
            </div>
          </section>

          <div className="w-full border-b"></div>

          <section id="data" className="space-y-4 p-4 uppercase">
            {option === "realtime" ? (
              <>
                {data.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        max magnitude location
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {getMaxMagnitudeLocationName()}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        max magnitude depth
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {getMaxDepth() + " KM"}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        max magnitude
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {getMaxMagnitude() + " SR"}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        Average Depth
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {getAvgDepth() + " km"}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        average magnitude
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {getAvgMagnitude().toFixed() + " SR"}
                      </h3>
                    </div>
                  </div>
                ) : (
                  "Loading..."
                )}
              </>
            ) : (
              <>
                {data.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        total houses destroyed
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {formatNumber(getTotalHousesDestroyed())}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        total houses damaged
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {formatNumber(getTotalHousesDamaged())}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        total deaths
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {formatNumber(getTotalDeaths())}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-light uppercase">
                        total injuries
                      </h4>
                      <h3 className="text-3xl font-semibold">
                        {formatNumber(getTotalInjuries())}
                      </h3>
                    </div>
                  </div>
                ) : (
                  "Loading..."
                )}
              </>
            )}
          </section>
        </div>
      </div>
      <DeckGL
        layers={layers}
        initialViewState={{
          longitude: data[0] ? data[0].coords.long : 0,
          latitude: data[0] ? data[0].coords.lat : 0,
          zoom: 3,
          maxZoom: 16,
          pitch: 0,
          bearing: 0,
        }}
        controller={true}
      >
        <Map
          reuseMaps={true}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        />
      </DeckGL>
    </main>
  );
}
