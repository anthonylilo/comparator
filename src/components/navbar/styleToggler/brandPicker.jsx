import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";

function BrandPicker() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialBrand = () => {
    const storedBrand = localStorage.getItem("selectedBrand");
    return storedBrand || "Purina";
  };

  const [selectedBrand, setSelectedBrand] = useState(getInitialBrand);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedBrand(selectedValue);
    localStorage.setItem("selectedBrand", selectedValue);
    localStorage.removeItem("editorContent");
    localStorage.removeItem("articleContent");

    switch (selectedValue) {
      case "Purina":
        navigate("/NSB/comparator/purina");
        break;
      case "Nutrition":
        navigate("/NSB/comparator/nutrition");
        break;
      case "Professional":
        navigate("/NSB/comparator/professional");
        break;
      case "Recetas":
        navigate("/NSB/comparator/recetas");
        break;
      case "NDG":
        navigate("/NSB/comparator/ndg");
        break;
      default:
        navigate("/");
    }
  };

  // Detectar marca desde la URL al cargar
  useEffect(() => {
    let brand = "Purina";
    if (location.pathname.includes("/nutrition"))
      brand = "Nutrition";
    else if (location.pathname.includes("/professional"))
      brand = "Professional";
    else if (location.pathname.includes("/recetas"))
      brand = "Recetas";
    else if (location.pathname.includes("/ndg"))
      brand = "NDG";

    setSelectedBrand(brand);
    localStorage.setItem("selectedBrand", brand);
  }, [location.pathname]);

  return (
    <Form.Select
      aria-label="Select the project"
      onChange={handleSelectChange}
      value={selectedBrand}
    >
      <option value="Purina">Purina</option>
      <option value="Nutrition">FamilyNes</option>
      <option value="Professional">Nestlé Professional</option>
      <option value="Recetas">Recetas LATAM</option>
      <option value="NDG">Nestlé Dolce Gusto</option>
    </Form.Select>
  );
}

export default BrandPicker;
