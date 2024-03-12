import { useState } from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function ArticleForm() {
  const [url, setUrl] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(url);
      setHtmlContent(response.data);
    } catch (error) {
      console.error('Error fetching HTML:', error);
    }
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Url of the article</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter article URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Example textarea</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Row>
      {htmlContent && (
        <Row className="mt-3">
          <pre>{htmlContent}</pre>
        </Row>
      )}
    </Container>
  );
}

export default ArticleForm;
