import { useState } from "react";

export const useArticleFormHooks = () => {
  const [url, setUrl] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [invalidLinks, setInvalidLinks] = useState([]);
  const [linkStatuses, setLinkStatuses] = useState({});
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [banner, setBanner] = useState(null);

  return {
    url,
    setUrl,
    textareaValue,
    setTextareaValue,
    imageUrls,
    setImageUrls,
    invalidLinks,
    setInvalidLinks,
    linkStatuses,
    setLinkStatuses,
    schema,
    setSchema,
    loading,
    setLoading,
    showAdditionalFields,
    setShowAdditionalFields,
    banner,
    setBanner,
  };
};
