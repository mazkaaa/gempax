"use client";
import countries from "@/components/countries.json";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface FilterInterface {
  country?: string[];
  start_year?: number;
  end_year?: number;
}

type ContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  getCountries: () => {
    id: string;
    description: string;
  }[];
  applyFilter: ({ country, start_year, end_year }: FilterInterface) => void;
  filter: FilterInterface;
};

const context = createContext<ContextType>({
  loading: false,
  setLoading: () => {},
  getCountries: () => [],
  applyFilter: () => {},
  filter: {
    country: [""],
    start_year: undefined,
    end_year: undefined,
  },
});

export const FilterProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterInterface>({
    country: [""],
    start_year: undefined,
    end_year: undefined,
  });

  const getCountries = () => countries;

  const applyFilter = ({ country, start_year, end_year }: FilterInterface) => {
    setFilter({
      country,
      start_year,
      end_year,
    });
  };

  return (
    <context.Provider
      value={{
        loading,
        setLoading,
        getCountries,
        applyFilter,
        filter,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useFilter = () => useContext(context);
