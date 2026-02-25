export const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/gs;

export const tagRegex = [
  {
    regex:
      /__ETIQUETAS DE IMAGEN__\s*__Alt Text:__\s*(.*?)\s*__Title de la imagen:__\s*(.*?)\s*__Nombre de la imagen:__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs,
    keys: ["altText", "title", "imageName"],
  },
];

export const metaDataPatterns = [
  {
    regex:
      /MERCADO:\s*(.*?)\s*OPTIMIZACIÓN No:\s*(.*?)\s*CATEGORÍA:\s*(.*?)\s*KW:\s*(.*?)\s*__SEO:__\s*__Title:__\s*(.*?)\s*\(.*?\)\s*__Meta descripción:__\s*(.*?)\s*\(.*?\)\s*Unificar las URLs.*?como única URL\s*(https:\/\/[^\s)]+).*?__FIN DE SEO__/is,
    keys: [
      "market",
      "optimizationNumber",
      "category",
      "keyword",
      "title",
      "metaDescription",
      "suggestedUrl",
    ],
  },
];

export const redirectionsRegex =
  /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;

export const articleRelatedRegex =
  /__ARTICULO RELACIONADO\s+([A-ZÁÉÍÓÚÑÜ ]+):__([\s\S]*?)__FIN ARTICULO__/g;

export const countries = [
  { value: "CR", label: "Costa Rica", region: "CAM" },
  { value: "SV", label: "El Salvador", region: "CAM" },
  { value: "GT", label: "Guatemala", region: "CAM" },
  { value: "HN", label: "Honduras", region: "CAM" },
  { value: "NI", label: "Nicaragua", region: "CAM" },
  { value: "PA", label: "Panama", region: "CAM" },
  { value: "AR", label: "Argentina", region: "PLATA" },
  { value: "PY", label: "Paraguay", region: "PLATA" },
  { value: "UY", label: "Uruguay", region: "PLATA" },
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
