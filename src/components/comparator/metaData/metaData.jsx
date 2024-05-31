import { Alert, ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

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
    titleMessage = "La cantidad de caracteres es menor a lo recomendado";
  } else if (IDEAL_CHAR_TITLE_SIZE) {
    titleColor = "primary";
    titleMessage = "La cantidad de caracteres es la ideal";
  }else if(WARNING_CHAR_TITLE_SIZE){
    titleColor = "warning";
    titleMessage = "Atencion: la cantidad de caracteres no es el ideal";
  }
  else if(MAX_CHAR_TITLE_SIZE) {
    titleColor = "danger";
    titleMessage = "La cantidad de caracteres supera lo recomendado";
  }
  if (MIN_CHAR_DESC_SIZE) {
    descriptionColor = "danger";
    descriptionMessage = "Error deberia de contener  meta description";
  } else if (IDEAL_CHAR_DESC_SIZE) {
    descriptionColor =  "primary";
    descriptionMessage = "La cantidad de caracteres es la ideal";
  } else if(MAX_CHAR_DESC_SIZE) {
    descriptionColor = "danger";
    descriptionMessage = "La cantidad de caracteres supera lo recomendado";
  }

  if(MAX_URL_SIZE){
    urlColor = "danger";
    urlMessage = "La longitud de URL supera lo recomendado"
  }else{
    urlColor = "primary";
    urlMessage = "La longitud de URL es el recomendado"
  }

  return (
    <Alert variant="warning" className="mt-3">
      <Alert.Heading>MetaData:</Alert.Heading>
      <ListGroup>
        <ListGroup.Item>
          <Badge bg={titleColor} className="me-2">
            {titleLength}
          </Badge>
          <span>Title: {title}</span>
          <div className={`text-${titleColor}`}>{titleMessage}</div>
          {descriptionColor.color}
        </ListGroup.Item>
        <ListGroup.Item>
          <Badge bg={descriptionColor} className="me-2">
            {descriptionLength}
          </Badge>
          <span >Meta Description: {metaDescription}</span>
          <div className={`text-${descriptionColor}`}>{descriptionMessage}</div>
        </ListGroup.Item>
        <ListGroup.Item>
          <Badge bg={urlColor} className="me-2">
            {urlLength}
          </Badge>
          <span >URL: {url}</span>
          <div className={`text-${urlColor}`}>{urlMessage   }</div>
        </ListGroup.Item>
      </ListGroup>
    </Alert>
  );
};

MetaData.propTypes = {
  title: PropTypes.string.isRequired,
  metaDescription: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default MetaData;
