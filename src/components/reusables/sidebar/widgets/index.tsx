"use client";

import { useApi } from "@/components/context/use-api";
import { useFilter } from "@/components/context/use-filter";
import React, { useEffect } from "react";
import GeneralWidget from "../../widget/general-widget";
import { GENERAL_INFORMATION_DATA } from "@/components/data";

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
            {GENERAL_INFORMATION_DATA.map((item, index) => (
              <div className="col-span-3" key={index}>
                <GeneralWidget
                  label={item.label}
                  value={item.formula(data, item.data_key)}
                  isLoading={loading}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Widgets;
