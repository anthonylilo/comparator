import { Container, Row, Col } from 'react-bootstrap'
import ArticleForm from './comparator/articleForm'

export default function HomePage() {
  const handleSubmit = (formData) => {
    // Aquí puedes manejar la lógica de la solicitud HTTP utilizando los datos del formulario (formData)
    console.log('Form data:', formData);
    // Realizar la solicitud HTTP aquí ...
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
      <h1>Comparator</h1>
        <Col md={6}>
          {/* Here have to be the editor */}
          <h3>Editor</h3>
        </Col>
        <Col md={6}>
          {/* Here have to be the comparator */}
          <ArticleForm onSubmit={handleSubmit} />
        </Col>
      </Row>
    </Container>
  );
}