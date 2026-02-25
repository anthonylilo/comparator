export const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/gs;

const TAG_BLOCK_END =
  /(?=\s*(?:__\s*ETIQUETAS\s+DE\s+IMAGEN|__\s*H[1-6]\s*:|__\s*Etiqueta\s*P\s*:|__\s*DATOS\s+ESTRUCTURADOS|__\s*REDIRECCIONES|!\[|<script|\Z|\d{1,3}\s*[\.\)]\s+))/i;

export const tagRegex = [
  {
    regex: new RegExp(
      [
        String.raw`__\s*ETIQUETAS\s+DE\s+IMAGEN(?:\s+ACTUAL)?(?:\s+DE\s+BANNER)?(?:\s+ACTUAL)?\s*:\s*__?\s*`,
        String.raw`(?:(?:__\s*)?URL\s*Sugerida\s*:\s*(?:__\s*)?(https?:\/\/[^\s]+)\s*)?`,
        String.raw`(?:(?:__\s*)?URL\s*Actual\s*:\s*(?:__\s*)?(https?:\/\/[^\s]+)\s*)?`,
        String.raw`(?:__\s*)?(?:Text\s*Alt|Alt\s*Text)\s*:\s*(?:__\s*)?([^\n\r]*)\s*`,
        String.raw`(?:__\s*)?(?:Title(?:\s*de\s*la\s*Imagen)?|Title)\s*:\s*(?:__\s*)?([^\n\r]*)\s*`,
        String.raw`(?:__\s*)?Nombre\s*de\s*la\s*imagen\s*:\s*(?:__\s*)?([^\n\r]*)`,
        String.raw`(?:\r?\n)?`,
        String.raw`(?:__\s*FIN\s+DE\s+ETIQUETAS\s*__\s*)?`,
      ].join(""),
      "g",
    ),
    keys: ["urlSuggested", "urlActual", "altText", "title", "imageName"],
  },
  {
    regex: new RegExp(
      [
        String.raw`__\s*ETIQUETAS\s+DE\s+IMAGEN(?:\s+ACTUAL)?(?:\s+DE\s+BANNER)?(?:\s+ACTUAL)?\s*:\s*__?\s*`,
        String.raw`(?:(?:__\s*)?URL\s*Actual\s*:\s*(?:__\s*)?(https?:\/\/[^\s]+)\s*)?`,
        String.raw`(?:(?:__\s*)?URL\s*Sugerida\s*:\s*(?:__\s*)?(https?:\/\/[^\s]+)\s*)?`,
        String.raw`(?:__\s*)?(?:Text\s*Alt|Alt\s*Text)\s*:\s*(?:__\s*)?([^\n\r]*)\s*`,
        String.raw`(?:__\s*)?(?:Title(?:\s*de\s*la\s*Imagen)?|Title)\s*:\s*(?:__\s*)?([^\n\r]*)\s*`,
        String.raw`(?:__\s*)?Nombre\s*de\s*la\s*imagen\s*:\s*(?:__\s*)?([^\n\r]*)`,
        String.raw`(?:\r?\n)?`,
        String.raw`(?:__\s*FIN\s+DE\s+ETIQUETAS\s*__\s*)?`,
      ].join(""),
      "g",
    ),
    keys: ["urlActual", "urlSuggested", "altText", "title", "imageName"],
  },
  {
    regex: new RegExp(
      [
        String.raw`__\s*ETIQUETAS\s+DE\s+IMAGEN(?:\s+ACTUAL)?(?:\s+DE\s+BANNER)?(?:\s+ACTUAL)?\s*:\s*__?\s*`,
        String.raw`(?:__\s*)?(?:Text\s*Alt|Alt\s*Text)\s*:\s*(?:__\s*)?([^\n\r]*)\s*`,
        String.raw`(?:__\s*)?(?:Title(?:\s*de\s*la\s*Imagen)?|Title)\s*:\s*(?:__\s*)?([^\n\r]*)\s*`,
        String.raw`(?:__\s*)?Nombre\s*de\s*la\s*imagen\s*:\s*(?:__\s*)?([^\n\r]*)`,
        String.raw`(?:\r?\n)?`,
        String.raw`(?:__\s*FIN\s+DE\s+ETIQUETAS\s*__\s*)?`,
      ].join(""),
      "g",
    ),
    keys: ["altText", "title", "imageName"],
  },
];

export const metaDataPatterns = [
  {
    regex:
      /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__FIN DE SEO\s*__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "suggestedUrl",
      "title",
      "metaDescription",
    ],
  },
  {
    regex:
      /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__#/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO\s*__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "oldUrl",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*(.*?)\s*__Meta Title:\s*(.*?)\s*__Meta Description:\s*(.*?)\s*__URL ACTUAL:\s*([^ ]+)\s*__URL SUGERIDA:\s*([^ ]+)\s*__FIN DE SEO__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "oldUrl",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*(https:\/\/[^\s]+)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "oldUrl",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(\d+)\s*CATEGORÍA:\s*(.*?)\s*__SEO:__\s*__Title:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__Meta descripción:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__\s*(.*?)\s*__URL SUGERIDA:__\s*(https:\/\/[^\s]+)\s*__FIN DE SEO__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "descriptionIntro",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(\d+)\s*CATEGORÍA:\s*(.*?)\s*__SEO:__\s*__Title:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__Meta descripción:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__\s*(.*?)\s*__URL ACTUAL:__\s*(https:\/\/[^\s]+)\s*\s*__URL SUGERIDA:__\s*(https:\/\/[^\s]+)\s*__FIN DE SEO__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "descriptionIntro",
      "oldUrl",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(\d+)\s*CATEGORÍA:\s*(.*?)\s*__SEO:__\s*__Title:__\s*(.*?)\s*__Meta descripción:__\s*(.*?)\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__\s*(.*?)\s*__URL SUGERIDA:__\s*(https:\/\/[^\s]+)\s*__FIN DE SEO__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "title",
      "metaDescription",
      "descriptionIntro",
      "suggestedUrl",
    ],
  },
  {
    regex:
      /\s*__MERCADO:__\s*(.*?)\s*__ARTÍCULO No:__\s*(\d+)\s*__CATEGORÍA:__\s*(.*?)\s*__Keyword sugerida:__\s*(.*?)\s*(?:MARCA SELECCIONADA:\s*.*?\s*)?__SEO:\s*__\s*__Title:__\s*([\s\S]*?)\s*(?:\(\d+\s*caracteres\))?\s*__Meta\s*(?:descripci[óo]n|description):__\s*([\s\S]*?)\s*(?:\(\d+\s*caracteres\))?\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__\s*([\s\S]*?)\s*__URL SUGERIDA:__\s*(https?:\/\/[^\s]+)\s*__FIN DE SEO__/,
    keys: [
      "market",
      "articleNumber",
      "category",
      "keyword",
      "title",
      "metaDescription",
      "descriptionIntro",
      "suggestedUrl",
    ],
  },
];

export const redirectionsRegex =
  /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;

export const schemaRegex =
  /__\s*DATOS\s+ESTRUCTURADOS\s*:?[^\n]*\n[\s\S]*?<script[^>]*?(?:type=["']application\/ld\+json["'][^>]*)?>([\s\S]*?)<\/script>/i;

const stripWrapper = (value) => {
  const stringValue = String(value || "");

  return stringValue
    .replace(/\u00A0/g, " ")
    .replace(/\uFEFF/g, "")
    .replace(/\\-/g, "-")
    .replace(/\\\./g, ".")
    .replace(/\\/g, "")
    .trim();
};

export const normalizeMetaLine = (line) => {
  let normalizedLine = stripWrapper(line);
  normalizedLine = normalizedLine
    .replace(/^__\s*URL\s*__\s*__\s*SUGERIDA\s*:\s*__\s*/i, "URL SUGERIDA: ")
    .replace(/^__\s*URL\s*__\s*__\s*ACTUAL\s*:\s*__\s*/i, "URL ACTUAL: ");

  normalizedLine = normalizedLine
    .replace(/^__\s*([\s\S]*?)\s*__$/g, "$1")
    .trim();
  normalizedLine = normalizedLine
    .replace(/^__\s*([^_]+?):\s*__\s*/g, "$1: ")
    .trim();
  normalizedLine = normalizedLine
    .replace(/^__\s*Title\s*:\s*__\s*/i, "Title: ")
    .trim();
  normalizedLine = normalizedLine
    .replace(/^__\s*Metadescription\s*:\s*__\s*/i, "Metadescription: ")
    .trim();
  normalizedLine = normalizedLine
    .replace(/^__\s*Meta\s*descripci[oó]n\s*:\s*__\s*/i, "Metadescription: ")
    .trim();
  // (Optional but recommended) Non-bold meta description variants
  normalizedLine = normalizedLine
    .replace(/^Meta\s*descripci[oó]n\s*:\s*/i, "Metadescription: ")
    .trim();
  normalizedLine = normalizedLine
    .replace(/^Meta\s*description\s*:\s*/i, "Metadescription: ")
    .trim();
  return normalizedLine;
};

export const isPurinaContentStart = (originalLine, normalizedLine) => {
  const normalizedValue =
    normalizedLine != null
      ? String(normalizedLine)
      : normalizeMetaLine(originalLine);
  return (
    /^#{1,6}\s+/.test(normalizedValue) ||
    /^__\s*H[1-6]\s*:/i.test(originalLine) ||
    /^!\[/.test(normalizedValue)
  );
};

export const metaLineRules = {
  isContentTagsLabel: /^ETIQUETAS\s+DE\s+CONTENIDO:/i,
  extractors: [
    { key: "market", test: /^MERCADO:\s*(.+)$/i },
    { key: "articleNumber", test: /^ART[IÍ]CULO\s*No:\s*(.+)$/i },
    { key: "category", test: /^CATEGOR[IÍ]A:\s*(.+)$/i },
    {
      key: "metaKeyWords",
      test: /^(?:Keyword\s*sugerida|KEYWORD\s*SUGERIDA):\s*(.+)$/i,
    },
    { key: "brandSelected", test: /^MARCA\s*SELECCIONADA:\s*(.+)$/i },
    { key: "title", test: /^Title:\s*(.+)$/i },
    {
      key: "metaDescription",
      test: /^Meta\s*(?:descripci[óo]n|description)\s*:\s*(.+)$/i,
    },
    { key: "metaDescription", test: /^Metadescription:\s*(.+)$/i },
    { key: "oldUrl", test: /^URL\s*ACTUAL:\s*(.+)$/i },
    { key: "suggestedUrl", test: /^URL\s*SUGERIDA:\s*(.+)$/i },
    {
      key: "descriptionIntro",
      test: /^DESCRIPCI[ÓO]N\s+INTRODUCTORIA\s+ART[IÍ]CULO:\s*(.+)$/i,
    },
  ],
};

export const cleanText = (text) => {
  const stringValue = String(text || "");
  return stringValue
    .replace(/\u00A0/g, " ")
    .replace(/\uFEFF/g, "")
    .replace(/\\-/g, "-")
    .replace(/\\\./g, ".")
    .replace(/\\/g, "")
    .replace(/\s*\(\d+\s+caracteres\)/g, "")
    .trim();
};

export const stripEtiquetaP = (text) => {
  const stringValue = String(text || "");
  return stringValue
    .replace(/^__\s*Etiqueta\s*P\s*:\s*__\s*/i, "")
    .replace(/^Etiqueta\s*P\s*:\s*/i, "")
    .replace(
      /^\s*(?:-|\*|•|–|—)\s*__\s*Etiqueta\s*P\s*:\s*__\s*/i,
      (matchValue) =>
        matchValue
          .replace(/__\s*Etiqueta\s*P\s*:\s*__/i, "")
          .replace(/\s+$/, " "),
    )
    .trim();
};

const stripOuterBold = (value) => {
  const stringValue = String(value || "");
  return stringValue.replace(/^__\s*([\s\S]*?)\s*__$/g, "$1");
};

export const sanitizeHeadingBold = (value) => {
  const match = String(value || "").match(/^(#{1,6})\s*(.+)$/);
  if (!match) return value;

  let innerText = match[2].trim();
  innerText = stripOuterBold(innerText);
  innerText = innerText.replace(/__+/g, "");
  return `${match[1]} ${innerText}`.trim();
};

const stripAllEmphasis = (value) => {
  const stringValue = String(value || "");
  return stringValue
    .replace(/__+/g, "")
    .replace(/\*+/g, "")
    .replace(/_+/g, "")
    .trim();
};

export const normalizePurinaHeading = (line) => {
  const rawLine = String(line || "").trim();
  const headingMatch = rawLine.match(
    /^__?\s*H([1-6])\s*:\s*([\s\S]*?)\s*__?$/i,
  );
  if (!headingMatch) return null;

  const level = Number(headingMatch[1]);
  let headingText = headingMatch[2] || "";

  headingText = cleanText(headingText);
  headingText = stripOuterBold(headingText);
  headingText = stripAllEmphasis(headingText);
  headingText = headingText.replace(/\s{2,}/g, " ").trim();

  if (!headingText) return null;
  return `${"#".repeat(level)} ${headingText}`;
};

const AI_DISCLAIMER_RE =
  /el contenido generado por ia puede ser incorrecto\.?/i;

export const sanitizeBase64Alt = (value) => {
  if (!value) return "";

  const stringValue = String(value);

  return stringValue
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !AI_DISCLAIMER_RE.test(line))
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const isIgnorableMergeGap = (rawGap) => {
  const gapText = String(rawGap || "");
  const compactGap = gapText.replace(/[\s_]+/g, "");

  if (compactGap === "") return true;

  const nonEmptyLines = gapText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (
    nonEmptyLines.length === 1 &&
    /^[\w\-]+\.(?:png|jpe?g|webp|gif|svg)$/i.test(nonEmptyLines[0])
  ) {
    return true;
  }

  return false;
};

export const extractMetaData = (contentParts) => {
  const extractedMetaData = {};
  let isProcessingMetaData = true;

  const updatedContentParts = contentParts.filter((item) => {
    if (item.type !== "paragraph") return true;

    const originalLine = String(item.data || "").trim();
    const normalizedLine = normalizeMetaLine(originalLine);

    if (!isProcessingMetaData) return true;
    if (!normalizedLine) return false;

    if (isPurinaContentStart(originalLine, normalizedLine)) {
      isProcessingMetaData = false;
      return true;
    }

    if (metaLineRules.isContentTagsLabel.test(normalizedLine)) return false;

    for (const rule of metaLineRules.extractors) {
      const metaMatch = normalizedLine.match(rule.test);
      if (metaMatch) {
        extractedMetaData[rule.key] = (metaMatch[1] || "").trim();
        return false;
      }
    }

    return true;
  });

  return { updatedContentParts, extractedMetaData };
};

export const processImages = (contentParts) => {
  const processedParts = [];
  let isInsideImageTagsBlock = false;
  let tempImageData = {};

  const isImageTagsHeader = (value) =>
    /^__?\s*ETIQUETAS\s+DE\s+IMAGEN/i.test(String(value || "").trim());

  const isBoundaryLine = (value) => {
    const stringValue = String(value || "").trim();
    return (
      /^__?\s*ETIQUETAS\s+DE\s+IMAGEN/i.test(stringValue) ||
      /^__?\s*H[1-6]\s*:/i.test(stringValue) ||
      /^#{1,6}\s+/.test(stringValue) ||
      /^__\s*DATOS\s*ESTRUCTURADOS/i.test(stringValue) ||
      /^__\s*REDIRECCIONES/i.test(stringValue) ||
      /^!\[/.test(stringValue) ||
      /^<script/i.test(stringValue) ||
      /^__?\s*Etiqueta\s*P\s*:/i.test(stringValue) ||
      /^Etiqueta\s*P\s*:/i.test(stringValue)
    );
  };

  const flushImagePlaceholderIfNeeded = () => {
    const hasAnyValue =
      tempImageData.alt ||
      tempImageData.title ||
      tempImageData.imageName ||
      tempImageData.urlActual ||
      tempImageData.urlSuggested;

    if (hasAnyValue) {
      processedParts.push({
        type: "image",
        data: {
          src: "/images/no-image.png",
          alt: tempImageData.alt || "",
          title: tempImageData.title || "",
          imageName: tempImageData.imageName || "",
          urlActual: tempImageData.urlActual || "",
          urlSuggested: tempImageData.urlSuggested || "",
        },
      });
    }

    tempImageData = {};
    isInsideImageTagsBlock = false;
  };

  const normalize = (rawLine) =>
    String(rawLine || "")
      .trim()
      .replace(/^__\s*/g, "")
      .replace(/\s*__$/g, "")
      .trim();

  // If we are inside tags-block, ONLY these lines are considered valid fields.
  const isKnownFieldLine = (normalizedLine) => {
    return (
      /^URL\s*Actual\s*:\s*/i.test(normalizedLine) ||
      /^URL\s*Sugerida\s*:\s*/i.test(normalizedLine) ||
      /^(?:Text\s*Alt|Alt\s*Text)\s*:\s*/i.test(normalizedLine) ||
      /^(?:Title(?:\s*de\s*la\s*Imagen)?|Title)\s*:\s*/i.test(normalizedLine) ||
      /^Nombre\s*de\s*la\s*imagen\s*:\s*/i.test(normalizedLine) ||
      /^FIN\s+DE\s+ETIQUETAS/i.test(normalizedLine)
    );
  };

  for (const part of contentParts) {
    if (part.type !== "paragraph") {
      if (isInsideImageTagsBlock) flushImagePlaceholderIfNeeded();
      processedParts.push(part);
      continue;
    }

    const rawLine = String(part.data || "").trim();
    const normalizedLine = normalize(rawLine);

    // Start block
    if (!isInsideImageTagsBlock) {
      if (isImageTagsHeader(rawLine) || isImageTagsHeader(normalizedLine)) {
        isInsideImageTagsBlock = true;
        tempImageData = {};
        continue;
      }
      processedParts.push(part);
      continue;
    }

    // Inside block
    if (!normalizedLine) continue;

    // Explicit end marker
    if (/^FIN\s+DE\s+ETIQUETAS/i.test(normalizedLine)) {
      flushImagePlaceholderIfNeeded();
      continue;
    }

    // Boundaries that must close the block
    if (isBoundaryLine(rawLine) || isBoundaryLine(normalizedLine)) {
      flushImagePlaceholderIfNeeded();

      if (isImageTagsHeader(rawLine) || isImageTagsHeader(normalizedLine)) {
        isInsideImageTagsBlock = true;
        tempImageData = {};
        continue;
      }

      processedParts.push(part);
      continue;
    }

    // Safety: if it's not a known field, close block and keep the line.
    if (!isKnownFieldLine(normalizedLine)) {
      flushImagePlaceholderIfNeeded();
      processedParts.push(part);
      continue;
    }

    // Parse known fields
    let matchResult;

    matchResult = normalizedLine.match(/^URL\s*Actual\s*:\s*(.+)$/i);
    if (matchResult) {
      tempImageData.urlActual = matchResult[1].trim();
      continue;
    }

    matchResult = normalizedLine.match(/^URL\s*Sugerida\s*:\s*(.+)$/i);
    if (matchResult) {
      tempImageData.urlSuggested = matchResult[1].trim();
      continue;
    }

    matchResult = normalizedLine.match(
      /^(?:Text\s*Alt|Alt\s*Text)\s*:\s*(.+)$/i,
    );
    if (matchResult) {
      tempImageData.alt = matchResult[1].trim();
      continue;
    }

    matchResult = normalizedLine.match(
      /^(?:Title(?:\s*de\s*la\s*Imagen)?|Title)\s*:\s*(.+)$/i,
    );
    if (matchResult) {
      tempImageData.title = matchResult[1].trim();
      continue;
    }

    matchResult = normalizedLine.match(
      /^Nombre\s*de\s*la\s*imagen\s*:\s*(.+)$/i,
    );
    if (matchResult) {
      tempImageData.imageName = matchResult[1].trim();
      continue;
    }

    flushImagePlaceholderIfNeeded();
    processedParts.push(part);
    continue;
  }

  if (isInsideImageTagsBlock) flushImagePlaceholderIfNeeded();

  return processedParts;
};
