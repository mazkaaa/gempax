"use client";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl";
import { ScreenGridLayer } from "@deck.gl/aggregation-layers/typed";
import { useState } from "react";
import { EarthquakeData } from "@/components/interfaces";
import { useFilter } from "@/components/context/use-filter";
import { useApi } from "@/components/context/use-api";

export default function Home() {
  const { data } = useApi();
  const { filter } = useFilter();

  const [cellSize, setCellSize] = useState<number>(18);

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
      data: data
        .filter((item) =>
          filter.start_year ? item.year >= filter.start_year : true,
        )
        .filter((item) =>
          filter.end_year ? item.year <= filter.end_year : true,
        ),
      opacity: 0.8,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.year,
      cellSizePixels: cellSize,
      colorRange: colorRange as any,
      aggregation: "SUM",
    }),
  ];

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
