"use client";

import { useApi } from "@/components/context/use-api";
import { useFilter } from "@/components/context/use-filter";
import React, { useEffect } from "react";
import {
  formatDigitNumber,
  getLessDestructiveYear,
  getLessFrequentYear,
  getMostDestructiveYear,
  getMostFrequentYear,
  getTotalDeaths,
  getTotalHousesDamaged,
  getTotalHousesDestroyed,
  getTotalInjuries,
} from "@/components/utils";
import GeneralWidget from "../../widget/general-widget";

const Widgets = () => {
  const { loading, fetchData, data } = useApi();
  const { filter } = useFilter();

  useEffect(() => {
    if (filter.country && filter.country[0] !== "") {
      fetchData({ country: filter.country[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div>
      <div className="flex flex-col divide-y divide-gray-300">
        <section id="general-widget" className="space-y-4 p-6">
          <h1 className="text-lg font-semibold">General Information</h1>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <GeneralWidget
                label="houses destroyed"
                value={formatDigitNumber(getTotalHousesDestroyed(data))}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="houses damaged"
                value={formatDigitNumber(getTotalHousesDamaged(data))}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="deaths"
                value={formatDigitNumber(getTotalDeaths(data))}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="injuries"
                value={formatDigitNumber(getTotalInjuries(data))}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="destructive year"
                value={getMostDestructiveYear(data)}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="less destructive year"
                value={getLessDestructiveYear(data)}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="most frequent year"
                value={getMostFrequentYear(data)}
                isLoading={loading}
              />
            </div>

            <div className="col-span-3">
              <GeneralWidget
                label="less frequent year"
                value={getLessFrequentYear(data)}
                isLoading={loading}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Widgets;
