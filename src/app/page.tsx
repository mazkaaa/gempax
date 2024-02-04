"use client";
import Image from "next/image";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl";
import { ScreenGridLayer } from "@deck.gl/aggregation-layers/typed";
import { useEffect, useState } from "react";
import { EarthquakeData } from "@/components/interfaces";
import CardInfo from "@/components/reusables/card-info";
import { api } from "@/components/constants";
import countries from "@/components/countries.json";

export default function Home() {
  const [data, setData] = useState<EarthquakeData[]>([]);
  const [loading, setLoading] = useState(false);

  const [country, setCountry] = useState("");

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
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.year,
      cellSizePixels: cellSize,
      colorRange: colorRange as any,
      aggregation: "SUM",
    }),
  ];

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    let page = 1;
    params.append("country", country);
    const res = await fetch(
      api.url + api.earthquakes.url + "?" + params.toString(),
    );
    const result = await res.json();
    const dataResult: EarthquakeData[] = result.items;
    // setData(dataResult);

    // loop through the pages and set the timeout to 3 second in promise
    page++;

    while (page <= result.totalPages) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const res = await fetch(
        api.url +
          api.earthquakes.url +
          "?" +
          params.toString() +
          "&page=" +
          page,
      );
      const result = await res.json();
      dataResult.push(...result.items);
      page++;
    }
    setData(dataResult);
    setLoading(false);
  };

  useEffect(() => {
    if (country !== "") {
      fetchData();
    }
  }, [country]);

  const getTotalHousesDestroyed = () => {
    return data.reduce((a, b) => (a || 0) + (b.housesDestroyed || 0), 0);
  };
  const getTotalHousesDamaged = () => {
    return data.reduce((a, b) => (a || 0) + (b.housesDamaged || 0), 0);
  };
  const getTotalDeaths = () => {
    return data.reduce((a, b) => (a || 0) + (b.deaths || 0), 0);
  };
  const getTotalInjuries = () => {
    return data.reduce((a, b) => (a || 0) + (b.injuries || 0), 0);
  };
  const getMostDestructiveYear = () => {
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

    return highestYear; // Ensure number type
  };
  const getLessDestructiveYear = () => {
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

    return highestYear;
  };
  const getMostFrequentYear = () => {
    const years = data.map((d) => d.year);
    const counts: {
      [key: number]: number;
    } = {};

    years.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });

    const max = Math.max(...Object.values(counts));
    const year = Object.keys(counts).find((key) => counts[key as any] === max);
    return year;
  };
  const getLessFrequentYear = () => {
    const years = data.map((d) => d.year);
    const counts: {
      [key: number]: number;
    } = {};

    years.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });

    const min = Math.min(...Object.values(counts));
    const year = Object.keys(counts).find((key) => counts[key as any] === min);
    return year;
  };

  const formatNumber = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
  };

  return (
    <main className="relative h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center px-6 md:hidden">
        <h1 className="text-center text-2xl">
          Mobile view is not supported yet, please use a desktop browser
        </h1>
      </div>

      <div className="hidden h-full w-full md:block">
        <div className="absolute right-4 top-4 z-50 text-gray-700">
          <div className="h-auto w-96 bg-white">
            <section id="about" className="space-y-2 p-4 ">
              <h1 className="text-lg font-semibold">Earthquake Events</h1>
              <div className="space-y-1">
                <p className="text-sm">
                  Information of destructive earthquakes from 2150 B.C. to the
                  present.
                </p>
                <p className="text-sm">
                  Data source:{" "}
                  <a
                    className="text-cyan-700"
                    href="https://www.ngdc.noaa.gov/hazel/view/hazards/earthquake/search"
                  >
                    National Centers for Environmental Information
                  </a>
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
                <div className="space-y-1">
                  <p className="text-sm">Country</p>
                  <select
                    className="select select-bordered select-sm w-full"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value={""}>Select country to view data</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country.id}>
                        {country.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {country === "" ? null : (
              <>
                <div className="w-full border-b"></div>
                <section id="data" className="space-y-4 p-4 uppercase">
                  {!loading && data.length > 0 ? (
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-3">
                        <CardInfo
                          title="total houses destroyed"
                          value={
                            formatNumber(getTotalHousesDestroyed())?.toString()!
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="total houses damaged"
                          value={
                            formatNumber(getTotalHousesDamaged())?.toString()!
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="total deaths"
                          value={formatNumber(getTotalDeaths())?.toString()!}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="total injuries"
                          value={formatNumber(getTotalInjuries())?.toString()!}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="most destructive year"
                          value={getMostDestructiveYear()!}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="less destructive year"
                          value={getLessDestructiveYear()!}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="most frequent year"
                          value={getMostFrequentYear()!}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="less frequent year"
                          value={getLessFrequentYear()!}
                        />
                      </div>
                    </div>
                  ) : (
                    "Loading..."
                  )}
                </section>
              </>
            )}
          </div>
        </div>
        <DeckGL
          layers={layers}
          initialViewState={{
            longitude: data[0] ? data[0].longitude : 0,
            latitude: data[0] ? data[0].latitude : 0,
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
      </div>
    </main>
  );
}
