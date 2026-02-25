export const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/gs;

export const tagRegex = [
  {
    regex:
      /__ETIQUETAS DE IMAGEN__\s*__TÍTULO__\s*(.*?)\s*__ALT TEXT DESCRIPTION__\s*(.*?)\s*__URL__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs,
    keys: ["title", "altText", "url"],
  },
];
export const metaDataPatterns = [
  {
    regex:
      /\s*__ETIQUETAS DE CONTENIDO\s*__\s*__PAGE TITLE\s*__\s*(.*?)\s*__META DESCRIPCIÓN\s*__\s*([\s\S]*?)\s*__CATEGORÍA\s*__\s*(.*?)\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs,
    keys: [
      "title",
      "metaDescription",
      "category",
      "introDescription",
    ],
  },
];
export const redirectionsRegex =
  /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;
export const schemaRegex = /__DATOS ESTRUCTURADOS__[\s\S]*?<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i;