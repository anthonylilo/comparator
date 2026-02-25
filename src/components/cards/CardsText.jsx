import React, { useMemo } from "react";
import { Card, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import CopyButton from "../copyToClipboard/CopyButton";

const CardsText = ({ item, variant = "article", className = "" }) => {
  const isObj = item && typeof item === "object";

  // Effective variant (use item's variant if provided)
  const computedVariant = isObj && item.variant ? item.variant : variant;

  // Header and badges (use item's values if provided; otherwise fall back to variant defaults)
  const header =
    (isObj && item.header) ||
    (computedVariant === "product" ? "Related products" : "Related article");

  const badges =
    isObj && Array.isArray(item.badges) && item.badges.length > 0
      ? item.badges
      : [computedVariant === "product" ? "Product" : "Article"];

  const rawHtml = useMemo(() => {
    if (!isObj) return String(item ?? "");
    if (typeof item.richHtml === "string") return item.richHtml;
    if (typeof item.data === "string" && item.data.trim().startsWith("<"))
      return item.data;
    if (typeof item.html === "string") return item.html;
    if (typeof item.contentHtml === "string") return item.contentHtml;
    if (typeof item.descriptionHtml === "string") return item.descriptionHtml;
    if (typeof item.dataHtml === "string") return item.dataHtml;

    // Minimal fallback builder when an "article-like" object is received
    const parts = [];
    if (item.title)
      parts.push(`<p><strong>${escapeHtml(item.title)}</strong></p>`);
    if (item.description) parts.push(`<p>${escapeHtml(item.description)}</p>`);
    if (item.url) {
      const u = escapeHtml(item.url);
      parts.push(
        `<p><a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a></p>`,
      );
    }
    return parts.join("");
  }, [item, isObj]);

  // 1) Convert __...__ to <strong>...</strong> within the provided HTML
  const applyStrong = (html = "") =>
    html.replace(/__\s*([\s\S]*?)\s*__/g, "<strong>$1</strong>");

  // 2) Ensure target/rel attributes exist on all links
  const ensureTargets = (html = "") =>
    html.replace(
      /<a\s+(?![^>]*\btarget=)[^>]*href=/gi,
      '<a target="_blank" rel="noopener noreferrer" href=',
    );

  // 3) Final HTML to render and to copy
  const contentHtml = useMemo(
    () => ensureTargets(applyStrong(rawHtml)),
    [rawHtml],
  );

  // 4) Plain text (visual backup if needed)
  const plainText = useMemo(() => {
    const tmp = document.createElement("div");
    tmp.innerHTML = contentHtml;
    return tmp.textContent || tmp.innerText || "";
  }, [contentHtml]);

  return (
    <Card className={`h-100 shadow-sm ${className}`}>
      <Card.Header className="card_Background_Color text-white d-flex align-items-center justify-content-between">
        <span className="small m-0">{header}</span>
        <div className="d-flex gap-1 flex-wrap">
          {badges.map((b, i) => (
            <Badge key={i} bg="light" text="dark">
              {b}
            </Badge>
          ))}
        </div>
      </Card.Header>

      <Card.Body
        className="cardtext-body-muted"
        style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
      >
        <div
          className="content-html"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <div className="d-flex justify-content-end mt-2">
          <CopyButton text={contentHtml || plainText} />
        </div>
      </Card.Body>
    </Card>
  );
};

// Utils
function escapeHtml(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

CardsText.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      variant: PropTypes.oneOf(["article", "product"]),
      header: PropTypes.string,
      badges: PropTypes.arrayOf(PropTypes.string),
      richHtml: PropTypes.string,
      data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      html: PropTypes.string,
      contentHtml: PropTypes.string,
      descriptionHtml: PropTypes.string,
      dataHtml: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      meta: PropTypes.object,
    }),
  ]).isRequired,
  variant: PropTypes.oneOf(["article", "product"]),
  className: PropTypes.string,
};

export default CardsText;
