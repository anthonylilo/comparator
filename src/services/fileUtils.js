import mammoth from "mammoth";
import { ProjectSettings } from "../services/settings/ProjectSettings";

export const FileUtils = async (
  file,
  selectedFormat,
  projectName,
  country = null
) => {
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToMarkdown({ arrayBuffer });
    const { config } = ProjectSettings(projectName);

    if (!config || !config.parseMarkdownContent) {
      throw new Error(`No parse configuration found for ${projectName}`);
    }

    if (projectName === "Professional") {
      return config.parseMarkdownContent(result.value, selectedFormat, country);
    }

    return config.parseMarkdownContent(result.value, selectedFormat);
  }
};
