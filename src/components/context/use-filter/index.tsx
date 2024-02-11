"use client";
import countries from "@/components/countries.json";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface FilterInterface {
  country: string[];
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
  isFilterApplied: (filter: FilterInterface) => boolean;
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
  isFilterApplied: () => false,
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
  const isFilterApplied = () => {
    return (
      filter.country.length > 0 ||
      filter.start_year !== undefined ||
      filter.end_year !== undefined
    );
  };

  return (
    <context.Provider
      value={{
        loading,
        setLoading,
        getCountries,
        applyFilter,
        filter,
        isFilterApplied,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useFilter = () => useContext(context);
