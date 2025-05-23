import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";

function BrandPicker() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialBrand = () => {
    const storedBrand = localStorage.getItem("selectedBrand");
    return storedBrand ? storedBrand : "0"; // Default value
  };

  const [selectedBrand, setSelectedBrand] = useState(getInitialBrand);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedBrand(selectedValue);

    // Guardar selección en localStorage
    localStorage.setItem("selectedBrand", selectedValue);
    localStorage.removeItem("editorContent");
    localStorage.removeItem("articleContent");

    // Navegar a diferentes rutas
    if (selectedValue === "1") {
      navigate("/NSB/comparator/purina");
    } else if (selectedValue === "2") {
      navigate("/NSB/comparator/nutrition");
    } else if (selectedValue === "3") {
      navigate("/NSB/comparator/professional");
    } else if (selectedValue === "4") {
      navigate("/NSB/comparator/recetas");
    }
      else if (selectedValue === "5") {
      navigate("/NSB/comparator/ndg");
    }
  };

  // Este efecto maneja la selección del valor basado en la ruta actual
  useEffect(() => {
    if (location.pathname.includes("/nutrition")) {
      setSelectedBrand("2");
    } else if (location.pathname.includes("/professional")) {
      setSelectedBrand("3");
    } else if (location.pathname.includes("/recetas")) {
      setSelectedBrand("4");
    } else if (location.pathname.includes("/ndg")) {
      setSelectedBrand("5");
    }else {
      setSelectedBrand("1");
    }
  }, [location.pathname]);

  return (
    <Form.Select
      aria-label="Select the project"
      onChange={handleSelectChange}
      value={selectedBrand}
    >
      <option value="1">Purina</option>
      <option value="2">FamilyNes</option>
      <option value="3">Nestlé Professional</option>
      <option value="4">Recetas LATAM</option>
      <option value="5">Nestlé Dolce Gusto</option>
    </Form.Select>
  );
}

export default BrandPicker;
