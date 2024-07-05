import { Alert, ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import { Table, Container, Row } from "react-bootstrap";

const MetaData = ({ title, metaDescription, url }) => {
  const titleLength = title ? title.length : 0;
  const descriptionLength = metaDescription ? metaDescription.length : 0;
  const urlLength = url ? url.length : 0;
  let titleColor, descriptionColor, titleMessage, descriptionMessage, urlColor, urlMessage;
  const MIN_CHAR_TITLE_SIZE = titleLength < 40
  const IDEAL_CHAR_TITLE_SIZE = titleLength >= 41 && titleLength <= 69
  const WARNING_CHAR_TITLE_SIZE = titleLength == 40 || titleLength == 70
  const MAX_CHAR_TITLE_SIZE = titleLength > 70
  const MIN_CHAR_DESC_SIZE = descriptionLength <= 0
  const IDEAL_CHAR_DESC_SIZE = descriptionLength >= 41 && descriptionLength <= 170
  const MAX_CHAR_DESC_SIZE = descriptionLength > 170
  const MAX_URL_SIZE = urlLength > 80

  if ( MIN_CHAR_TITLE_SIZE) {
    titleColor = "danger";
    titleMessage = "The number of characters is less than recommended";
    } else if (IDEAL_CHAR_TITLE_SIZE) {
    titleColor = "primary";
    titleMessage = "The number of characters is ideal";
    }else if(WARNING_CHAR_TITLE_SIZE){
    titleColor = "warning";
    titleMessage = "Attention: the number of characters is not ideal";
    }
    else if(MAX_CHAR_TITLE_SIZE) {
    titleColor = "danger";
    titleMessage = "The number of characters exceeds the recommended amount";
    }
    if (MIN_CHAR_DESC_SIZE) {
    descriptionColor = "danger";
    descriptionMessage = "Error: it should contain meta description";
    } else if (IDEAL_CHAR_DESC_SIZE) {
    descriptionColor = "primary";
    descriptionMessage = "The number of characters is ideal";
    } else if(MAX_CHAR_DESC_SIZE) {
    descriptionColor = "danger";
    descriptionMessage = "The number of characters exceeds the recommended amount";
    
  }

  if(MAX_URL_SIZE){
    urlColor = "danger";
    urlMessage = "The URL lenght surpases the recommended length"
  }else{
    urlColor = "primary";
    urlMessage = "The URL Length is ok"
  }

  return (
    <Container>
      <h3>MetaData:</h3>
      <p>(Metatitle, Metadescription, URL lenght) </p>
      <Container className="tableContainer">
      <Table hover responsive className="schemaTable">
        <tbody>
          <tr>
            <th>Title Length</th>
            <td>
              <Badge bg={titleColor} className="me-2">
                {titleLength}
              </Badge>
            </td>
          </tr>
          <tr>
            <th>Title</th>
            <td>
              <span>Title: {title}</span>
              <div className={`text-${titleColor}`}>{titleMessage}</div>
              {descriptionColor.color}
            </td>
          </tr>
          <tr>
            <th>Description Length</th>
            <td>
              <Badge bg={descriptionColor} className="me-2">
                {descriptionLength}
              </Badge>
            </td>
          </tr>
          <tr>
            <th>Meta Description</th>
            <td>
              <span>Meta Description: {metaDescription}</span>
              <div className={`text-${descriptionColor}`}>{descriptionMessage}</div>
            </td>
          </tr>
          <tr>
            <th>URL Length</th>
            <td>
              <Badge bg={urlColor} className="me-2">
                {urlLength}
              </Badge>
            </td>
          </tr>
          <tr>
            <th>URL</th>
            <td>
              <span>URL: {url}</span>
              <div className={`text-${urlColor}`}>{urlMessage}</div>
            </td>
          </tr>
        </tbody>
      </Table>
      </Container>
      </Container>
  );
};  

MetaData.propTypes = {
  title: PropTypes.string.isRequired,
  metaDescription: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default MetaData;
