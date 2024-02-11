"use client";
import countries from "@/components/countries.json";

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
};

const context = createContext<ContextType>({
  loading: false,
  setLoading: () => {},
});

export const ApiProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  return (
    <context.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useApi = () => useContext(context);
