import React, { createContext, useContext, useState } from "react";

const CountryContext = createContext(undefined);

export const useCountry = () => useContext(CountryContext);

// The hook is sure not to throw an error if it's outside the provider.
export const useSafeCountry = () => {
  const context = useContext(CountryContext);
  return context || { country: null, setCountry: () => {} };
};

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState("");

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
};
