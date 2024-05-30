import { Container, Row, Col } from "react-bootstrap";
import ArticleForm from "../components/comparator/articleForm";
import Editor from "../components/editor/editor";
import HomeNavbar from "../components/navbar/homeNavbar";

export default function HomePage() {
  return (
    <>
      <HomeNavbar />
      <Container>
        <Container className="main" fluid>
          <Row>
            <Col md={6}>
              <h3>Editor</h3>
              <Editor />
            </Col>
            <Col md={6}>
              <h3>Comparador</h3>
              <ArticleForm />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}
