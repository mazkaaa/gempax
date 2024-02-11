"use client";

import { useFilter } from "@/components/context/use-filter";
import React from "react";

const Filters = () => {
  const { getCountries: countries, applyFilter } = useFilter();

  return (
    <div className="flex flex-col divide-y divide-gray-300">
      <section id="about" className="space-y-2 p-6">
        <h1 className="text-lg font-semibold">Earthquake Events</h1>
        <div className="flex flex-col space-y-1">
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

      <section className="space-y-4 p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">
            Country <span className="text-xs text-red-600">(required)</span>
          </p>
          <select
            className="select select-bordered select-sm w-full"
            onChange={(e) => applyFilter({ country: [e.target.value] })}
          >
            <option value={""}>Select country to view data</option>
            {countries().map((country, index) => (
              <option key={index} value={country.id} className="capitalize">
                {country.id.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">Start year</p>
          <select
            className="select select-bordered select-sm w-full"
            onChange={(e) => applyFilter({ country: [e.target.value] })}
          >
            <option value={""}>Select start year range</option>
            {Array.from({
              length: new Date().getFullYear() + 1 - 1900,
            }).map((_, i) => (
              <option key={i} value={1900 + i}>
                {1900 + i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">End year</p>
          <select
            className="select select-bordered select-sm w-full"
            onChange={(e) => applyFilter({ country: [e.target.value] })}
          >
            <option value={""}>Select end year range</option>
            {Array.from({
              length: new Date().getFullYear() + 1 - 1900,
            }).map((_, i) => (
              <option key={i} value={1900 + i}>
                {1900 + i}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
};

export default Filters;
