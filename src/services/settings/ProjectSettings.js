import PurinaSettings from "./purina/PurinaSettings";
import { PurinaCrawler } from "./purina/PurinaCrawler";

import nutrition from "./nutrition/NutritionSettings";
import { nutritionCrawler } from "./nutrition/NutritionCrawler";

import ProfessionalSettings from "./professional/ProfessionalSettings";
import { ProfessionalCrawler } from "./professional/ProfessionalCrawler";

import recetas from "./recetas/Recetas";
import { recetasCrawler } from "./recetas/RecetasCrawler";

import ndg from "./ndg/Ndg";
import { ndgCrawler } from "./ndg/NdgCrawler";

const settingsMap = {
  Purina: { config: PurinaSettings, crawler: PurinaCrawler },
  Nutrition: { config: nutrition, crawler: nutritionCrawler },
  Professional: { config: ProfessionalSettings, crawler: ProfessionalCrawler },
  Recetas: { config: recetas, crawler: recetasCrawler },
  NDG: { config: ndg, crawler: ndgCrawler },
};

export const ProjectSettings = () => {
  const brand = localStorage.getItem("selectedBrand") || "Purina";
  return (
    settingsMap[brand] || {
      config: {
        brand: brand,
        status: "inProgress",
      },
      crawler: async () => {
        console.warn(`Crawler for ${brand} is not ready`);
        return { message: "Crawler in progress" };
      },
    }
  );
};
