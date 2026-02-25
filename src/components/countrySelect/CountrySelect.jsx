import React, { useState } from "react";
import { useCountry } from "../../services/CountryContext";

const CountrySelect = () => {
  const { country, setCountry } = useCountry();

  const countries = [
    // Central America (CAM)
    { value: "CR", label: "Costa Rica", region: "CAM" },
    { value: "SV", label: "El Salvador", region: "CAM" },
    { value: "GT", label: "Guatemala", region: "CAM" },
    { value: "HN", label: "Honduras", region: "CAM" },
    { value: "NI", label: "Nicaragua", region: "CAM" },
    { value: "PA", label: "Panama", region: "CAM" },

    // Plata Region
    { value: "AR", label: "Argentina", region: "PLATA" },
    { value: "PY", label: "Paraguay", region: "PLATA" },
    { value: "UY", label: "Uruguay", region: "PLATA" },

    // Other Latin American countries
    { value: "TT", label: "ADC", region: "OTHER" },
    { value: "BO", label: "Bolivia", region: "OTHER" },
    { value: "CL", label: "Chile", region: "OTHER" },
    { value: "CO", label: "Colombia", region: "OTHER" },
    { value: "DO", label: "Dominicana", region: "OTHER" },
    { value: "EC", label: "Ecuador", region: "OTHER" },
    { value: "MX", label: "México", region: "OTHER" },
    { value: "PE", label: "Peru", region: "OTHER" },
    { value: "VE", label: "Venezuela", region: "OTHER" },
  ];

  const handleChange = (e) => {
    setCountry(e.target.value);
  };

  const sortByLabel = (arr) =>
    arr.slice().sort((a, b) => a.label.localeCompare(b.label));

  const renderOptions = () => {
    const camCountries = sortByLabel(
      countries.filter((c) => c.region === "CAM")
    );
    const plataCountries = sortByLabel(
      countries.filter((c) => c.region === "PLATA")
    );
    const otherCountries = sortByLabel(
      countries.filter((c) => c.region === "OTHER")
    );

    return (
      <>
        <optgroup label="CAM">
          {camCountries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Plata">
          {plataCountries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Other">
          {otherCountries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </optgroup>
      </>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Select Country</h2>
      <select
        id="country-select"
        value={country}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a country</option>
        {renderOptions()}
      </select>
      {country && (
        <p className="text-sm mt-2 text-blue-600">
          <strong>Selected:</strong>{" "}
          {countries.find((c) => c.value === country)?.label}
        </p>
      )}
    </div>
  );
};

export default CountrySelect;
