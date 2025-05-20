import React from "react";
import { Alert, ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import { Table, Container, Row } from "react-bootstrap";
import SeoCheckerPage from "../../pages/seoCheckerPage";

const SeoChecker = ({ metaData }) => {
  const {
    title,
    metaDescription,
    suggestedUrl: url,
    market,
    articleNumber,
    category,
    oldUrl,
    h1Title,
    metaRobots,
    metaKeyWords,
    metaGeoRegion,
    metaGeoPlacename,
    introDescription,
  } = metaData;

  const titleLength = title ? title.length : 0;
  const descriptionLength = metaDescription ? metaDescription.length : 0;
  const urlLength = url ? url.length : 0;

  let titleColor, descriptionColor, urlColor;
  let titleMessage, descriptionMessage, urlMessage;

  const MIN_CHAR_TITLE_SIZE = titleLength < 40;
  const IDEAL_CHAR_TITLE_SIZE = titleLength >= 41 && titleLength <= 69;
  const WARNING_CHAR_TITLE_SIZE = titleLength === 40 || titleLength === 70;
  const MAX_CHAR_TITLE_SIZE = titleLength > 70;
  const MIN_CHAR_DESC_SIZE = descriptionLength <= 0;
  const IDEAL_CHAR_DESC_SIZE =
    descriptionLength >= 41 && descriptionLength <= 170;
  const MAX_CHAR_DESC_SIZE = descriptionLength > 170;
  const urlLastSegment =
    url && url.includes("/") ? url.substring(url.lastIndexOf("/") + 1) : "";
  const urlLastSegmentLength = urlLastSegment.length;

  if (urlLastSegmentLength > 40) {
    urlColor = "danger";
    urlMessage =
      "The final segment of the URL is longer than 40 characters. (" +
      urlLastSegmentLength +
      ")";
  } else {
    urlColor = "primary";
    urlMessage =
      "The final segment of the URL is within the limit of the (" +
      urlLastSegmentLength +
      ")";
  }

  if (MIN_CHAR_TITLE_SIZE) {
    titleColor = "danger";
    titleMessage = "The number of characters is less than recommended";
  } else if (IDEAL_CHAR_TITLE_SIZE) {
    titleColor = "primary";
    titleMessage = "The number of characters is ideal";
  } else if (WARNING_CHAR_TITLE_SIZE) {
    titleColor = "warning";
    titleMessage = "Attention: the number of characters is not ideal";
  } else if (MAX_CHAR_TITLE_SIZE) {
    titleColor = "danger";
    titleMessage = "The number of characters exceeds the recommended amount";
  }

  if (MIN_CHAR_DESC_SIZE) {
    descriptionColor = "danger";
    descriptionMessage = "Error: it should contain meta description";
  } else if (IDEAL_CHAR_DESC_SIZE) {
    descriptionColor = "primary";
    descriptionMessage = "The number of characters is ideal";
  } else if (MAX_CHAR_DESC_SIZE) {
    descriptionColor = "danger";
    descriptionMessage =
      "The number of characters exceeds the recommended amount";
  }

  return (
    <Container className="mt-3">
      <Row>
        <h3>MetaData:</h3>
        <Container className="tableContainer">
          <Table hover responsive className="schemaTable">
            <tbody>
              <tr>
                <th>Meta Title</th>
                <td>
                  <span>{title}</span>
                  <div className={`text-${titleColor}`}>{titleMessage}</div>
                  <Badge bg={titleColor} className="me-2">
                    {titleLength}
                  </Badge>
                </td>
              </tr>
              <tr>
                <th>Meta Description</th>
                <td>
                  <span>{metaDescription}</span>
                  <div className={`text-${descriptionColor}`}>
                    {descriptionMessage}{" "}
                    <Badge bg={descriptionColor} className="me-2">
                      {descriptionLength}
                    </Badge>
                  </div>
                </td>
              </tr>
              {introDescription && (
                <tr>
                  <th>Intro Description</th>
                  <td>
                    <span>{introDescription}</span>
                  </td>
                </tr>
              )}
              <tr>
                <th>URL</th>
                <td>
                  <span>{url}</span>
                  <div className={`text-${urlColor}`}>
                    {urlMessage}{" "}
                    <Badge bg={urlColor} className="me-2">
                      {urlLastSegmentLength}
                    </Badge>
                  </div>
                </td>
              </tr>
              {category && (
                <tr>
                  <th>Category</th>
                  <td>{category}</td>
                </tr>
              )}
              {oldUrl && (
                <tr>
                  <th>Actual URL</th>
                  <td>{oldUrl}</td>
                </tr>
              )}
              {h1Title && (
                <tr>
                  <th>H1 Title</th>
                  <td>{h1Title}</td>
                </tr>
              )}
              <tr>
                <th>Index/Follow</th>
                <td>{metaRobots ? metaRobots : "index, follow"}</td>
              </tr>
              {metaKeyWords && (
                <tr>
                  <th>Keywords</th>
                  <td>{metaKeyWords ? metaKeyWords : "UNDEFINED"}</td>
                </tr>
              )}
              {metaGeoRegion && (
                <tr>
                  <th>Geo Region</th>
                  <td>{metaGeoRegion}</td>
                </tr>
              )}
              {metaGeoPlacename && (
                <tr>
                  <th>Geo Placename</th>
                  <td>{metaGeoPlacename}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </Row>
    </Container>
  );
};

SeoChecker.propTypes = {
  metaData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    metaDescription: PropTypes.string.isRequired,
    suggestedUrl: PropTypes.string.isRequired,
    market: PropTypes.string,
    articleNumber: PropTypes.string,
    category: PropTypes.string,
    oldUrl: PropTypes.string,
    h1Title: PropTypes.string,
    metaRobots: PropTypes.string,
    metaKeyWords: PropTypes.string,
    metaGeoRegion: PropTypes.string,
    metaGeoPlacename: PropTypes.string,
  }).isRequired,
};

export default SeoChecker;
