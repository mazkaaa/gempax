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
import {
  getLessDestructiveYear,
  getLessFrequentYear,
  getMostDestructiveYear,
  getMostFrequentYear,
  getTotalDeaths,
  getTotalHousesDamaged,
  getTotalHousesDestroyed,
  getTotalInjuries,
} from "@/components/utils";

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
        <div className="absolute right-4 top-4 z-50 hidden text-gray-700">
          <div className="h-auto w-full max-w-md divide-y divide-gray-300 bg-white">
            <section id="about" className="space-y-2 p-6">
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

            <section id="filter" className="space-y-4 p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm">Cell size</label>
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
                {/* <div className="w-full border-b"></div> */}
                <section id="data" className="space-y-4 p-6 uppercase">
                  {!loading && data.length > 0 ? (
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-3">
                        <CardInfo
                          title="total houses destroyed"
                          value={
                            formatNumber(
                              getTotalHousesDestroyed(data),
                            )?.toString()!
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="total houses damaged"
                          value={
                            formatNumber(
                              getTotalHousesDamaged(data),
                            )?.toString()!
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="total deaths"
                          value={
                            formatNumber(getTotalDeaths(data))?.toString()!
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="total injuries"
                          value={
                            formatNumber(getTotalInjuries(data))?.toString()!
                          }
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="most destructive year"
                          value={getMostDestructiveYear(data)}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="less destructive year"
                          value={getLessDestructiveYear(data)}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="most frequent year"
                          value={getMostFrequentYear(data)}
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <CardInfo
                          title="less frequent year"
                          value={getLessFrequentYear(data)}
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
            mapStyle="mapbox://styles/mazkaaa/cls7ow75x01dn01r45gz55hrp"
          />
        </DeckGL>
      </div>
    </main>
  );
}
