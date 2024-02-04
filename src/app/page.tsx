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
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.eqMagnitude || 0,
      cellSizePixels: cellSize,
      colorRange: colorRange as any,
      aggregation: "SUM",
    }),
  ];

  const fetchData = async () => {
    const params = new URLSearchParams();
    let page = 1;
    params.append("country", "indonesia");
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAvgDepth = () => {
    const array = data.map((d) => d.eqDepth);
    const sum = array.reduce((a, b) => (a || 0) + (b || 0));
    return sum || 0 / array.length;
  };
  const getAvgMagnitude = () => {
    const array = data.map((d) => d.eqMagnitude);
    const sum = array.reduce((a, b) => (a || 0) + (b || 0));
    return sum || 0 / array.length;
  };
  const getMaxMagnitudeLocationName = () => {
    const max = Math.max(...data.map((d) => d.eqMagnitude || 0));
    const maxData = data.find((d) => d.eqMagnitude === max);
    return maxData?.locationName.split(" ")[1] || "N/A";
  };
  const getMaxMagnitude = () => {
    return Math.max(...data.map((d) => d.eqMagnitude || 0));
  };
  const getMaxDepth = () => {
    return Math.max(...data.map((d) => d.eqDepth || 0));
  };

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
    const mostDestructiveYear = data.reduce((prev, current) =>
      (prev.housesDestroyedTotal || 0) > (current.housesDestroyedTotal || 0)
        ? prev
        : current,
    );
    return mostDestructiveYear.year;
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
              </div>
            </section>

            <div className="w-full border-b"></div>

            <section id="data" className="space-y-4 p-4 uppercase">
              {data.length > 0 ? (
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
                      value={formatNumber(getTotalHousesDamaged())?.toString()!}
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
                      value={new Date(getMostDestructiveYear())
                        .getFullYear()
                        .toString()}
                    />
                  </div>
                </div>
              ) : (
                "Loading..."
              )}
            </section>
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
