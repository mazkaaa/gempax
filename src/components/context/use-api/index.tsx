"use client";
import { api } from "@/components/constants";
import { EarthquakeData } from "@/components/interfaces";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type ContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchData: ({ country }: { country: string }) => Promise<void>;
  data: EarthquakeData[];
};

const context = createContext<ContextType>({
  loading: false,
  setLoading: () => {},
  fetchData: async () => {},
  data: [],
});

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarthquakeData[]>([]);
  //   setLoading(true);
  //   let page = 1;
  //   const params = new URLSearchParams();
  //   params.append("country", country);

  //   const res = await fetch(
  //     api.url + api.earthquakes.url + "?" + params.toString(),
  //   );
  //   const result = await res.json();
  //   const dataResult: EarthquakeData[] = result.items;
  //   page++;

  //   while (page <= result.totalPages) {
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     const res = await fetch(
  //       api.url +
  //         api.earthquakes.url +
  //         "?" +
  //         params.toString() +
  //         "&page=" +
  //         page,
  //     );
  //     const result = await res.json();
  //     dataResult.push(...result.items);
  //     page++;
  //   }
  //   setData(dataResult);
  //   setLoading(false);
  // };

  const fetchData = useCallback(async ({ country }: { country: string }) => {
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
  }, []);

  return (
    <context.Provider
      value={{
        loading,
        setLoading,
        fetchData,
        data,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useApi = () => useContext(context);
