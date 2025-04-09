import { useState } from "react";

export const useArticleFormHooks = () => {
  const [url, setUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [invalidLinks, setInvalidLinks] = useState([]);
  const [linkStatuses, setLinkStatuses] = useState({});
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaRobots, setMetaRobots] = useState("");
  const [metaKeyWords, setMetaKeyWords] = useState("");
  const [metaGeoRegion, setMetaGeoRegion] = useState("");
  const [metaGeoPlacename, setMetaGeoPlacename] = useState("");
  const [banner, setBanner] = useState(null);
  const [articleContent, setArticleContent] = useState([]);
  const [headingTitle, setHeadingTitle] = useState("");

  return {
    url,
    setUrl,
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
    title,
    setTitle,
    metaDescription,
    setMetaDescription,
    metaRobots,
    setMetaRobots,
    metaKeyWords,
    setMetaKeyWords,
    metaGeoRegion,
    setMetaGeoRegion,
    metaGeoPlacename,
    setMetaGeoPlacename,
    banner,
    setBanner,
    articleContent,
    setArticleContent,
    headingTitle,
    setHeadingTitle,
  };
};
