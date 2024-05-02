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
  const [metaDescription, setMetaDescription] = useState('');
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState(null);
  const [articleContent, setArticleContent] = useState("");

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
    metaDescription,
    setMetaDescription,
    title,
    setTitle,
    banner,
    setBanner,
    articleContent,
    setArticleContent
  };
};
