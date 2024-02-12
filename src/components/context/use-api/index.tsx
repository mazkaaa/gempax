"use client";
import { api } from "@/components/constants";
import countries from "@/components/countries.json";
import { EarthquakeData } from "@/components/interfaces";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type ContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  filteredData: ({
    country,
    start_year,
    end_year,
  }: {
    country?: string | undefined;
    start_year?: number | undefined;
    end_year?: number | undefined;
  }) => EarthquakeData[];
  fetchData: ({ country }: { country: string }) => Promise<void>;
};

const context = createContext<ContextType>({
  loading: false,
  setLoading: () => {},
  filteredData: () => [],
  fetchData: async () => {},
});

export const ApiProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarthquakeData[]>([]);

  const addData = (input: EarthquakeData) => {
    setData((old) => [...old, input]);
  };

  const isContainData = ({
    id,
    country,
  }: {
    id?: number;
    country?: string;
  }) => {
    if (id) {
      return data.some((item) => item.id === id);
    }
    return data.some((item) => item.country === country);
  };

  const filteredData = ({
    country,
    start_year,
    end_year,
  }: {
    country?: string;
    start_year?: number;
    end_year?: number;
  }) => {
    if (country) return data.filter((item) => item.country === country);
    if (start_year && end_year) {
      return data.filter(
        (item) => item.year >= start_year && item.year <= end_year,
      );
    } else {
      if (start_year) return data.filter((item) => item.year >= start_year);
      if (end_year) return data.filter((item) => item.year <= end_year);
    }
    return [];
  };

  // const deleteData = ({
  //   country,
  //   start_year,
  //   end_year,
  // }: {
  //   country?: string;
  //   start_year?: number;
  //   end_year?: number;
  // }) => {
  //   if (id) {
  //     setData(data.filter((item) => item.id !== id));
  //   } else {
  //     setData(data.filter((item) => item.country !== country));
  //   }
  // };

  const clearData = () => {
    setData([]);
  };

  const fetchData = async ({ country }: { country: string }) => {
    setLoading(true);
    let page = 1;
    const params = new URLSearchParams();
    params.append("country", country);

    const res = await fetch(
      api.url + api.earthquakes.url + "?" + params.toString(),
    );
    const result = await res.json();
    const dataResult: EarthquakeData[] = result.items;
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

  return (
    <context.Provider
      value={{
        loading,
        setLoading,
        filteredData,
        fetchData,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useApi = () => useContext(context);
